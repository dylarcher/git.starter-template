# Crafting Your Project's Welcome Mat: A README Template

## Introduction

This repository serves as a comprehensive starter template for new Git projects.
It aims to provide a well-structured, best-practice foundation, enabling
developers to kickstart their projects quickly with pre-configured tools and
workflows.

**Example:**

```markdown
# My Awesome Project

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

## II. Core Purpose & Goals

*(This section is crucial for setting context. It's similar to an "Author's
Intent" but for the project as a whole.)*

* **What problem does your project solve?**
* **What are the main goals or vision for this project?**
* **Who is the intended audience or user base?**

**Guidance:**
Be clear and compelling. This helps others understand the value and direction of
your project.

## III. Key Features / Modules

* List the most important features or components of your project.
* Briefly describe what each feature does.
* Use bullet points for readability.

**Example:**

```markdown
## Key Features

*   **Feature A:** Enables users to accomplish Task 1 seamlessly.
*   **Feature B:** Provides advanced analytics for Data Set Z.
*   **Module C:** Integrates with External Service Q.
```

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

* **Prerequisites:** List any software or tools users need before they can use
    your project (e.g., Node.js version, Python version, specific libraries).
* **Installation Steps:** Provide clear, step-by-step instructions on how to
    install your project.
* **Basic Usage:** A simple example of how to run or use the project once
    installed.

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

* Node.js (v14 or higher)
* npm (v6 or higher)

This template includes a reusable workflow
(`.github/workflows/update-from-template.yml`) to help you pull in updates and
new features from this template into your own project.

1. Clone the repository: `git clone https://github.com/yourusername/yourproject.git`
2. Navigate to the project directory: `cd yourproject`
3. Install dependencies: `npm install`
4. **Ensure your project was created from this template.**
5. **Go to the "Actions" tab in your repository.**
6. **Select the "Update from Template" workflow** from the list of workflows.
7. **Click the "Run workflow" button.** You can usually leave the default
    branch (`main` or `master`) selected.
8. This workflow will fetch the latest changes from
    `dylarcher/git.starter-template`, create a new branch in your repository
    with these changes, and open a pull request.
9. **Review the pull request** carefully. It will contain all the commits made
    to this template since you last updated or since your project was created.
10. **Merge the pull request** to incorporate the updates. You may need to
    resolve merge conflicts if you've made changes to the same files that were
    updated in the template.

`npm start`

### Updating from the Original Template

This project was generated from
`https://github.com/dylarcher/git.starter-template`. To pull in the latest
updates from this template repository, you can use the `update-template` script.

This script will:

1. Ensure a git remote named `template` points to
    `https://github.com/dylarcher/git.starter-template.git`.
2. Fetch the latest changes from the `template` remote.
3. Merge the changes from `template/main` into your current branch, allowing
    for unrelated histories.

To run the script:

```bash
npm run update-template
```

It's recommended to use the workflow for a more streamlined process.

## V. How to Contribute

Contributions to improve this template are welcome! Please see the
[CONTRIBUTING.md](.github/CONTRIBUTING.md) file for guidelines.

**Example:**

```markdown
## How to Contribute

We welcome contributions! Please see our [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines on how to get involved, report issues, and submit pull requests.
```

## VI. License

* State the license under which your project is released.
* Link to the `LICENSE` file in your repository.

**Example:**

```markdown
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

## VII. (Optional) Further Sections

Consider adding other sections as your project grows or based on its nature:

* **API Documentation:** If your project is a library or API.
* **Examples:** More detailed usage examples.
* **Roadmap:** Future plans for the project.
* **Acknowledgements:** If you want to credit inspirations or major
    contributors.
* **Contact/Support:** How users can get help.

---

**Remember to replace placeholders and examples with your project's specific
information! Good luck!**
