# Git Starter Template

## Introduction

This repository serves as a comprehensive starter template for new Git projects.
It aims to provide a well-structured, best-practice foundation, enabling
developers to kickstart their projects quickly with pre-configured tools and
workflows.

## Core Purpose and Goals

The primary goal of `git.starter-template` is to:

* **Standardize Project Setup:** Offer a consistent structure for new
    repositories.
* **Promote Best Practices:** Integrate tools and configurations that
    encourage high-quality code and contributions.
* **Automate Common Tasks:** Include GitHub Actions workflows for linting,
    formatting, testing, and more.
* **Streamline Contributions:** Provide clear guidelines and templates for
    issues and pull requests.
* **Facilitate Updates:** Make it easy for projects generated from this
    template to pull in upstream changes.

## Key Features

This template comes packed with features to get you started:

* **Pre-configured Linters & Formatters:**
  * [Biome](https://biomejs.dev/) for JavaScript/TypeScript linting and formatting.
  * `markdownlint` for Markdown file consistency.
  * `yaml-lint` for YAML file validation.
* **GitHub Actions Workflows:**
  * `format.yml`: Automatically formats code on pull requests and commits changes to the PR branch.
  * `lint.yml`: Lints code (JavaScript, Markdown, YAML) on pull requests and commits changes to the PR branch.
  * `test.yml`: Runs tests (example setup included).
  * `codeql.yml`: Integrates GitHub's CodeQL for security analysis.
  * `changelog.yml`: Generates a changelog from commit messages.
  * `stale.yml`: Marks inactive issues and pull requests as stale.
  * `issue.yml`: Summarizes new issues using AI and comments on them.
  * `label.yml`: Automatically labels pull requests based on conventional commit prefixes.
  * `update-from-template.yml`: A reusable workflow to help update projects generated from this template.
* **Issue and Pull Request Templates:**
  * Comprehensive templates for bug reports, feature requests, documentation improvements, and more.
  * A default pull request template.
* **Dependabot Configuration:**
  * `dependabot.yml` is set up to help keep dependencies up-to-date.
* **EditorConfig & VSCode Settings:**
  * `.editorconfig` for consistent coding styles across different editors.
  * Recommended VSCode extensions and settings in `.vscode/`.
* **Code Ownership:**
  * `.github/CODEOWNERS` file to define default reviewers.
* **Security Policy:**
  * `SECURITY.md` outlining how to report vulnerabilities.
* **Node.js Versioning:**
  * `.nvmrc` to specify the recommended Node.js version.

## How to Use This Template

1. **Create a New Repository:**
    * Click the "**Use this template**" button on the GitHub page of this repository.
    * Select "**Create a new repository**".
    * Choose an owner, provide a repository name, and set its visibility.
    * Click "**Create repository**".

2. **Clone Your New Repository:**

    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd YOUR_REPOSITORY_NAME
    ```

3. **Customize the Project:**
    * **Search and Replace:** Globally search for `dylarcher/git.starter-template` and replace it with `YOUR_USERNAME/YOUR_REPOSITORY_NAME` in files like `README.md`, `CITATION.cff`, and potentially workflow files if they contain direct repository references. Also, update any author-specific information (e.g., in `CITATION.cff`).
    * **Project Name & Description:** Update `package.json` (if it's a Node.js project) and other relevant files with your project's specific name, description, author, etc.
    * **LICENSE:** While this template uses the MIT License, ensure it's appropriate for your project or replace `LICENSE` with your chosen license.
    * **Remove Unnecessary Files:** Delete any example code (`src/`, `test/`), documentation (`docs/`), or configuration files that are not relevant to your project. For instance, if your project isn't JavaScript-based, remove `package.json`, `.npmrc`, `.nvmrc`, and Biome configurations.
    * **Update `CHANGELOG.md`:** You might want to clear or re-initialize the `CHANGELOG.md` for your new project.
    * **Review Workflows:** Adjust the GitHub Actions workflows in `.github/workflows/` to suit your project's needs (e.g., specific build steps, deployment configurations).

## Updating a Project Generated From This Template

This template includes a reusable workflow
(`.github/workflows/update-from-template.yml`) to help you pull in updates and
new features from this template into your own project.

To use it:

1. **Ensure your project was created from this template.**
2. **Go to the "Actions" tab in your repository.**
3. **Select the "Update from Template" workflow** from the list of workflows.
4. **Click the "Run workflow" button.** You can usually leave the default
    branch (`main` or `master`) selected.
5. This workflow will fetch the latest changes from
    `dylarcher/git.starter-template`, create a new branch in your repository
    with these changes, and open a pull request.
6. **Review the pull request** carefully. It will contain all the commits made
    to this template since you last updated or since your project was created.
7. **Merge the pull request** to incorporate the updates. You may need to
    resolve merge conflicts if you've made changes to the same files that were
    updated in the template.

Alternatively, you can manually fetch and merge changes:

```bash
# Add this template as a remote repository (only needs to be done once)
git remote add template https://github.com/dylarcher/git.starter-template.git

# Fetch updates from the template
git fetch template

# Merge changes from the template's main branch into your current branch
# (Ensure your working directory is clean before running this)
git merge template/main --allow-unrelated-histories

# Resolve any merge conflicts, then commit the changes
git commit -m "Merge updates from template"

# Push the changes to your repository
git push
```

It's recommended to use the workflow for a more streamlined process.

## Contributing

Contributions to improve this template are welcome! Please see the
[CONTRIBUTING.md](.github/CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the terms of the [MIT License](LICENSE).
