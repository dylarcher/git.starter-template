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

    // 1. Read package.json (existing code)
    const packageJsonPath = path.resolve("./package.json")
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8")
    const packageJson = JSON.parse(packageJsonContent)
    const currentVersion = packageJson.version
    console.log(`Current version from package.json: ${currentVersion}`)
    if (!currentVersion) throw new Error("Version not found in package.json")

    // 2. Get latest tag (existing code)
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

    // 3. Get commit messages (existing code)
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
      // Added a way to force update if needed
      console.log(
        "No new commits found. Changelog will not be updated unless forced.",
      )
      // It's important that the workflow step that commits checks if the file changed.
      // So, we can simply exit here if no commits.
      return // Exit if no commits and not forced
    }
    console.log(
      `Found ${commits.length} commits since ${previousVersionTag || "the beginning"}.`,
    )

    // 4. Categorize commits (existing code)
    const categorizedCommits = {}
    const miscellaneousCategory = "Miscellaneous"
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
      categorizedCommits[category].push(
        `- ${subject} ([${commit.hash.substring(0, 7)}])`,
      )
    }
    console.log("Commits categorized.")

    // 5. Read existing CHANGELOG.md (existing code)
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
      newEntry += "### No notable changes\n" // Or some other placeholder
    } else {
      for (const category in categorizedCommits) {
        newEntry += `### ${category}`
        for (const commitMsg in categorizedCommits[category]) {
          newEntry += `${commitMsg}`
        }
        newEntry += "\n" // Add a blank line after each category section
      }
      newEntry = `${newEntry.trim()}\n` // Remove trailing newline and add one back
    }

    // Ensure there's an [Unreleased] section, either the existing one or a new one.
    const unreleasedHeader = "## [Unreleased]"
    let existingUnreleasedContent = ""
    const unreleasedMatch = changelogContent.match(
      /## \[Unreleased\]([\s\S]*?)(?=\n## \[|$)/,
    )

    if (unreleasedMatch?.[1]) {
      existingUnreleasedContent = unreleasedMatch[1].trim()
        ? unreleasedMatch[1]
        : "\n" // Preserve content or ensure a newline
    } else {
      // If [Unreleased] section doesn't exist at all, ensure we add it above the new version.
      existingUnreleasedContent = "\n" // Default to a newline if not found or empty
    }

    // Remove the old [Unreleased] section and its content before re-adding it.
    changelogContent = changelogContent.replace(
      /## \[Unreleased\]([\s\S]*?)(?=\n## \[|$)/,
      "$1",
    )
    if (!changelogContent.includes("## [")) {
      // If no other versions, ensure Unreleased is at the top
      changelogContent = changelogContent.replace(
        /# Changelog\n\n/,
        `# Changelog\n\n${unreleasedHeader}\n${existingUnreleasedContent.trim()}\n\n`,
      )
    }

    // Find the position to insert the new entry.
    // It should be right after the "## [Unreleased]" section or after the main header if [Unreleased] is not present.
    const insertionMarker = "## [Unreleased]"
    const headerEndMarker = "# Changelog" // Fallback if [Unreleased] is somehow missing after logic above

    let insertPosition = changelogContent.indexOf(insertionMarker)
    if (insertPosition !== -1) {
      insertPosition = changelogContent.indexOf("\n", insertPosition) + 1 // After the [Unreleased] line
      // If there was content under [Unreleased], find the end of that content.
      // This logic assumes [Unreleased] is followed by a blank line or another header.
      const nextHeaderPos = changelogContent.indexOf("\n## [", insertPosition)
      if (nextHeaderPos !== -1) {
        // Adjust the insertion position to be before the next version header.
        insertPosition = nextHeaderPos
      }
    } else {
      // Fallback: if [Unreleased] is not found, insert after the main changelog title and description.
      insertPosition = changelogContent.indexOf(headerEndMarker)
      if (insertPosition !== -1) {
        // Find the end of the main header block (usually followed by two newlines)
        const headerBlockEnd = changelogContent.indexOf("\n\n", insertPosition)
        insertPosition =
          headerBlockEnd !== -1 ? headerBlockEnd + 2 : changelogContent.length
      } else {
        // If even "# Changelog" is not found (e.g. totally empty file), prepend.
        insertPosition = 0
      }
    }

    // A simpler way to insert: always put the new [Unreleased] at the top, then the new version, then the rest.
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
      : changelogContent.includes(headerEndMarker)
        ? changelogContent.substring(
          changelogContent.indexOf(headerEndMarker) + headerEndMarker.length,
        )
        : changelogContent

    // Reconstruct the changelog
    // 1. Main header (e.g., "# Changelog\n\nDescription") // Removed ...
    // 2. New [Unreleased] section (empty or with its previous content if any)
    // 3. The new version's entry
    // 4. The rest of the old changelog entries

    // If [Unreleased] was empty or just newlines, ensure it's just the header + one newline.
    const unreleasedSectionContent = existingUnreleasedContent.trim()
      ? existingUnreleasedContent
      : "\n"
    if (unreleasedSectionContent === "\n" && commits.length > 0) {
      // If we just added commits, the [Unreleased] section should be empty for next time.
    }

    let finalChangelog = `${mainHeaderPart.trim()}

${unreleasedHeader}
${unreleasedSectionContent.trim() ? `${unreleasedSectionContent.trim()}\n\n` : "\n"}${newEntry.trim()}
`

    // Append older versions. Remove any existing entry for currentVersion to avoid duplicates.
    const olderVersionsRegex = new RegExp(
      `\n## \\[${currentVersion.replace(/\./g, "\\.")}\\][\\s\\S]*?(?=\n## \\[|$)`,
      "g",
    )
    const olderContent = restOfChangelog.replace(olderVersionsRegex, "").trim()

    if (olderContent) {
      finalChangelog += `
${olderContent}
`
    }

    // 7. Write updated CHANGELOG.md
    await fs.writeFile(changelogPath, `${finalChangelog.trim()}\n`, "utf8")
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
