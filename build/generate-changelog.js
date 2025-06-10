import { execSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"

const conventionalCommitTypes = {
  feat: "Features",
  fix: "Bug Fixes",
  docs: "Documentation",
  style: "Styles",
  refactor: "Code Refactoring",
  perf: "Performance Improvements",
  test: "Tests",
  build: "Build System",
  ci: "Continuous Integration",
  chore: "Chores",
  revert: "Reverts",
}

async function main() {
  try {
    console.log("Starting changelog generation...")

    // 1. Read package.json
    const packageJsonPath = path.resolve("./package.json")
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8")
    const packageJson = JSON.parse(packageJsonContent)
    const currentVersion = packageJson.version
    console.log(`Current version from package.json: ${currentVersion}`)
    if (!currentVersion) throw new Error("Version not found in package.json")

    // Determine repository URL
    let repoUrl = ""
    if (packageJson.repository) {
      if (typeof packageJson.repository === 'string') {
        if (packageJson.repository.startsWith('http')) {
          repoUrl = packageJson.repository.replace('.git', '');
        }
      } else if (typeof packageJson.repository === 'object' && packageJson.repository.url) {
        repoUrl = packageJson.repository.url.replace('git+', '').replace('.git', '');
      }
    }
    // Try to get from git remote if not in package.json or not a usable URL
    if (!repoUrl || !repoUrl.includes('github.com')) { // Added check for github.com
        try {
           const remoteUrl = execSync('git remote get-url origin').toString().trim();
           if (remoteUrl.includes('github.com')) { // Ensure it's a github remote
               repoUrl = remoteUrl.replace('git@github.com:', 'https://github.com/').replace('.git', '');
           } else {
               console.warn('Origin remote is not a GitHub URL.');
               repoUrl = ''; // Reset if not a GitHub URL
           }
        } catch (e) { console.warn('Could not determine repository URL from git remote.'); repoUrl = ''; }
    }
    console.log(`Determined repository URL: ${repoUrl || 'Not found (will not link commits)'}`);


    // 2. Get latest tag
    let previousVersionTag = ""
    try {
      previousVersionTag = execSync(
        'git describe --tags --abbrev=0 --match "v[0-9]*.[0-9]*.[0-9]*" --match "[0-9]*.[0-9]*.[0-9]*"',
      )
        .toString()
        .trim()
      console.log(`Latest tag found: ${previousVersionTag}`)
    } catch (e) {
      try {
        previousVersionTag = execSync("git rev-list --max-parents=0 HEAD")
          .toString()
          .trim()
        console.log(
          `No version tags found. Using the first commit as the base: ${previousVersionTag}`,
        )
      } catch (firstCommitError) {
        console.warn("Could not get the first commit.", firstCommitError)
        previousVersionTag = ""
      }
    }

    // 3. Get commit messages
    const commitLogFormat = "%H%x00%s%x00%b%x00"
    let commitLog = ""
    if (previousVersionTag) {
      commitLog = execSync(
        `git log ${previousVersionTag}..HEAD --pretty=format:"${commitLogFormat}"`,
      )
        .toString()
        .trim()
    } else {
      commitLog = execSync(`git log --pretty=format:"${commitLogFormat}"`)
        .toString()
        .trim()
    }
    const commits = commitLog
      .split("\x00\n")
      .filter(Boolean)
      .map((commitEntry) => {
        const parts = commitEntry.split("\x00")
        return { hash: parts[0], subject: parts[1], body: parts[2] || "" }
      })

    if (commits.length === 0 && !process.env.FORCE_UPDATE_CHANGELOG) {
      console.log(
        "No new commits found. Changelog will not be updated unless forced.",
      )
      return
    }
    console.log(
      `Found ${commits.length} commits since ${previousVersionTag || "the beginning"}.`,
    )

    // 4. Categorize commits
    const categorizedCommits = {}
    const miscellaneousCategory = "Miscellaneous"
    let versionLinkDefinitions = {}; // Initialize here for the current version

    for (const commit of commits) {
      let type = null
      let subject = commit.subject
      const match = commit.subject.match(
        /^([a-zA-Z]+)(\([a-zA-Z0-9_-]+\))?(!)?:(.*)/,
      )
      if (match) {
        type = match[1].toLowerCase()
        subject = match[4].trim()
      }
      const category = conventionalCommitTypes[type] || miscellaneousCategory
      if (!categorizedCommits[category]) categorizedCommits[category] = []

      const fullHash = commit.hash;
      const shortHash = fullHash.substring(0, 7);
      const commitLinkRef = `${shortHash}-commit`;

      categorizedCommits[category].push(
        `- ${subject} ([${shortHash}][${commitLinkRef}])`,
      )
      if (repoUrl) { // Only add if repoUrl is found
        versionLinkDefinitions[commitLinkRef] = `${repoUrl}/commit/${fullHash}`;
      }
    }
    console.log("Commits categorized.")

    // 5. Read existing CHANGELOG.md
    const changelogPath = path.resolve("./CHANGELOG.md")
    let changelogContent = ""
    try {
      changelogContent = await fs.readFile(changelogPath, "utf8")
      console.log("Successfully read CHANGELOG.md")
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("CHANGELOG.md not found. A new one will be created.")
        changelogContent = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
`
      } else {
        throw error
      }
    }

    // 6. Generate new changelog content
    console.log("Generating new changelog content...")
    const today = new Date().toISOString().split("T")[0]
    let newEntry = `## [${currentVersion}] - ${today}`

    if (commits.length === 0) {
      newEntry += "\n### No notable changes\n"
    } else {
      for (const category in categorizedCommits) {
        newEntry += `\n### ${category}\n`;
        let commitMessagesForCategory = "";
        for (const commitMsg of categorizedCommits[category]) { // Use 'of' for array iteration
            commitMessagesForCategory += `  ${commitMsg}\n`;
        }
        newEntry += commitMessagesForCategory.trimEnd(); // Add messages and remove last newline
        newEntry += "\n" // Ensure a newline after the list of commits for the category
      }
      newEntry = `${newEntry.trim()}\n`;

      const collectedDefs = Object.entries(versionLinkDefinitions)
                               .map(([ref, url]) => `[${ref}]: ${url}`)
                               .join("\n");
      if (collectedDefs) {
        newEntry += "\n" + collectedDefs + "\n";
      }
    }
    versionLinkDefinitions = {}; // Reset for safety, though script exits

    const unreleasedHeader = "## [Unreleased]"
    let existingUnreleasedContent = ""
    const unreleasedMatch = changelogContent.match(
      /## \[Unreleased\]([\s\S]*?)(?=\n## \[|$)/,
    )

    if (unreleasedMatch?.[1]) {
      existingUnreleasedContent = unreleasedMatch[1].trim()
        ? unreleasedMatch[1]
        : "\n"
    } else {
      existingUnreleasedContent = "\n"
    }

    const topPart = changelogContent.match(
      /^# Changelog[\s\S]*?(?=\n## \[Unreleased\]|$)/,
    )
    const mainHeaderPart = topPart
      ? topPart[0]
      : `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).`

    const restOfChangelog = unreleasedMatch
      ? changelogContent.substring(
        Number(unreleasedMatch?.index) + unreleasedMatch[0].length,
      )
      : changelogContent.includes("# Changelog") // Check for "# Changelog"
        ? changelogContent.substring(
          changelogContent.indexOf("# Changelog") + "# Changelog".length,
        )
        : changelogContent


    const unreleasedSectionContent = existingUnreleasedContent.trim()
      ? existingUnreleasedContent
      : "\n"

    let finalChangelog = `${mainHeaderPart.trim()}

${unreleasedHeader}
${unreleasedSectionContent.trim() ? `${unreleasedSectionContent.trim()}\n\n` : "\n"}${newEntry.trim()}
`
    const olderVersionsRegex = new RegExp(
      `\n## \\[${currentVersion.replace(/\./g, "\\.")}\\][\\s\\S]*?(?=\n## \\[|$)`,
      "g",
    )
    const olderContent = restOfChangelog.replace(olderVersionsRegex, "").trim()

    if (olderContent) {
      finalChangelog += `\n\n${olderContent}\n` // Added \n\n for spacing if older content exists
    } else {
      finalChangelog += `\n` // Ensure a final newline
    }

    // 7. Write updated CHANGELOG.md
    await fs.writeFile(changelogPath, `${finalChangelog.trim()}\n`, "utf8") // Trim and add one final newline
    console.log(
      `Successfully updated ${changelogPath} for version ${currentVersion}`,
    )
    const githubOutputPath = process.env.GITHUB_OUTPUT
    if (githubOutputPath) {
      await fs.appendFile(
        githubOutputPath,
        `new_version=${currentVersion}\n`,
        "utf8",
      )
    } else {
      console.warn(
        "GITHUB_OUTPUT environment variable is not set. Unable to write output.",
      )
    }
  } catch (error) {
    console.error("Error generating changelog:", error)
    process.exit(1)
  }
}

main()
