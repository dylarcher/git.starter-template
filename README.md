# Git Starter Template

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containe
rs&message=Open&color=blue&logo=visualstudiocode)](<https://vscode.dev/redirect?u>
rl=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=<https://github>.
com/dylarcher/git.starter-template)

## Introduction

This repository serves as a comprehensive starter template for new Git projects.
It aims to provide a well-structured, best-practice foundation, enabling
developers to kickstart their projects quickly with pre-configured tools and
workflows.

## Core Purpose and Goals

The primary goal of `git.starter-template` is to:

* **Standardize Project Setup:** Offer a consistent structure for new
  repositories.
* **Promote Best Practices:** Integrate tools and configurations that encourage
  high-quality code and contributions.
* **Automate Common Tasks:** Include GitHub Actions workflows for linting,
  formatting, testing, and more.
* **Streamline Contributions:** Provide clear guidelines and templates for
  issues and pull requests.
* **Facilitate Updates:** Make it easy for projects generated from this template
  to pull in upstream changes.

## Key Features

This template comes packed with features to get you started:

* **Pre-configured Linters & Formatters:**
  * [Biome](https://biomejs.dev/) for JavaScript/TypeScript linting and
    formatting.
  * `markdownlint` for Markdown file consistency.
  * `yaml-lint` for YAML file validation.
* **GitHub Actions Workflows:**
  * `format.yml`: Automatically formats code upon push.
  * `lint.yml`: Lints code (JavaScript, Markdown, YAML) on pushes and pull
    requests.
  * `test.yml`: Runs tests (example setup included).
  * `codeql.yml`: Integrates GitHub's CodeQL for security analysis.
  * `changelog.yml`: Generates a changelog from commit messages.
  * `stale.yml`: Marks inactive issues and pull requests as stale.
  * `issue.yml`: Assigns and labels new issues automatically.
  * `label.yml`: Automatically labels pull requests based on conventional commit
    prefixes.
  * `update-from-template.yml`: A reusable workflow to help update projects
    generated from this template.
* **Issue and Pull Request Templates:**
  * Comprehensive templates for bug reports, feature requests, documentation
    improvements, and more.
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
4. **Click the "Run workflow" button.** You can usually leave the default branch
   (`main` or `master`) selected.
5. This workflow will fetch the latest changes from
   `dylarcher/git.starter-template`, create a new branch in your repository with
   these changes, and open a pull request.
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

## Adapting the Template for Different Project Types

This template is configured by default for a general Node.js project that can be
published as an NPM package and potentially include a CLI. However, its
structure and tooling can be adapted for a variety of other project types. This
section outlines key considerations and changes you might need to make for
different kinds of projects.

### VSCode Extension

To adapt this template for a VSCode Extension:

* **Key Files & `package.json`:**
  * The `package.json` file is crucial. You'll need to set or modify fields
    like:
    * `name`: A unique name for your extension (e.g., `my-vscode-extension`).
    * `displayName`: The name shown in the VSCode Marketplace.
    * `description`: A description for the Marketplace.
    * `publisher`: Your VSCode Marketplace publisher ID.
    * `version`: Your extension's version.
    * `engines.vscode`: Specify the VSCode version compatibility (e.g., `^1.80.0`). This is already present in the template but you should verify the version.
    * `activationEvents`: Define when your extension gets activated (e.g., `onCommand:myExtension.startCommand`, `onLanguage:javascript`).
    * `main`: Points to your extension's entry point JavaScript file (e.g., `./dist/extension.js` or `./out/extension.js` if you transpile TypeScript).
    * `contributes`: This is where you define contributions like commands, keybindings, settings, views, language features, etc. (e.g., `contributes.commands`, `contributes.keybindings`).
    * `devDependencies`: Include `@types/vscode` (consider moving from optionalDependencies if definitively a VSCode project), `vsce` (for packaging/publishing), and tools like `vscode-test` or `@vscode/test-electron` for testing.
  * The template's `.vscode/launch.json` might be useful for debugging your
    extension.
  * The template's `.vscode/extensions.json` can recommend related extensions
    for your users/contributors.

* **Source Code:**
  * Your main extension logic will typically reside in `src/extension.ts` (if
    using TypeScript) or `src/extension.js`.
  * You will likely remove the template's default `src/index.js`,
    `src/bin/cli.js`, and `test/index.test.js`, `test/cli.test.js`.
  * Update `tsconfig.json` if using TypeScript, ensuring `outDir` points to
    where your compiled JS will go (e.g., `out` or `dist`). The `module` should
    typically be `commonjs`.

* **Build Process:**
  * Modify `package.json` scripts:
    * The `build` script should compile your TypeScript (e.g., `tsc -p ./`) or bundle your JavaScript.
    * Add scripts for packaging (`vsce package`) and publishing (`vsce publish`).
  * The template's `build/script.js` is likely not needed.

* **Testing:**
  * Use `vscode-test` or `@vscode/test-electron` to run integration tests
    against a VSCode instance. Your test scripts in `package.json` will need to
    be updated.

### Files to Potentially Remove

This section summarizes files that might need removal across different project
types:

#### VSCode Extensions

* `bin/cli.js` (unless your extension also provides a CLI tool).
* `src/index.js`, `src/bin/cli.js`
* `build/script.js`
* Review GitHub Actions workflows. Linting, formatting, and CodeQL can be kept.
  The `test.yml` will need to be adapted for VSCode extension testing.

#### Browser Extensions

* Files specific to browser extensions (e.g., `manifest.json`).
* Review directory structure and remove unnecessary template files.

Refer to this section when adapting the template for your specific project type.

* **Publishing:**
  * Use `vsce` to package (`.vsix` file) and publish to the Visual Studio Code
    Marketplace.

Refer to the official
[VSCode Extension API documentation](https://code.visualstudio.com/api)
 for detailed guidance.

### Browser Extension

To adapt this template for a Browser Extension (e.g., for Chrome, Firefox,
Edge):

* **`manifest.json`:**
  * This is the most important file for a browser extension. You'll need to
    create it in your project root or a designated source folder.
  * It defines the extension's name, version, permissions, background scripts,
    content scripts, browser actions (popup), page actions, options page, icons,
    etc.
  * Example:

        ```json
        {
          "manifest_version": 3,
          "name": "My Awesome Extension",
          "version": "1.0",
          "description": "Does awesome things in your browser.",
          "icons": {
            "16": "images/icon16.png",
            "48": "images/icon48.png",
            "128": "images/icon128.png"
          },
          "action": {
            "default_popup": "popup/popup.html",
            "default_icon": "images/icon48.png"
          },
          "background": {
            "service_worker": "background.js"
          },
          "content_scripts": [
            {
              "matches": ["<all_urls>"],
              "js": ["content.js"]
            }
          ],
          "permissions": ["activeTab", "storage"]
        }
        ```

* **Directory Structure:**
  * A common structure includes:
    * `manifest.json` (at the root of your packaged extension, often in `src/` or `public/` during development)
    * `icons/`: Directory for various icon sizes.
    * `popup/`: HTML, CSS, JS for the extension's popup.
    * `options/`: HTML, CSS, JS for an options page.
    * `background_scripts/` or `background.js`: For background service workers/scripts.
    * `content_scripts/` or `content.js`: For scripts injected into web pages.
    * `js/` or `lib/`: Shared JavaScript code.
  * You can place these within the `src/` directory.

* **`package.json`:**
  * `name`, `version`, `description` should be consistent with your
    `manifest.json`.
  * You might not need `main`, `module`, `exports` if you're not publishing this
    as an NPM package. The `private: true` field can be set.
  * `devDependencies` might include tools for bundling (like Webpack, Parcel, or
    Rollup), linters (ESLint for JS, Stylelint for CSS), testing frameworks, and
    browser type definitions like `@types/chrome` (consider moving from
    optionalDependencies if definitively a browser extension project).
  * Scripts would be for building/bundling your extension into a distributable
    format (e.g., a `zip` file or a `dist/` directory ready for
    loading/packaging).

* **Build Process:**
  * If using plain JavaScript, HTML, CSS, your build process might just be
    copying files to a `dist/` folder.
  * If using TypeScript, SASS, or modern JS modules, you'll need a build step
    (e.g., using `tsc`, `sass`, and a bundler like Webpack/Parcel/Rollup)
    configured via `package.json` scripts.
  * The template's `build/script.js` and `tsconfig.json` might need significant
    changes or removal/replacement depending on your chosen stack.

* **Source Code & Files:**
  * Remove `src/index.js`, `src/bin/cli.js`, and their tests if they are not
    relevant.
  * Your HTML, CSS, and JavaScript files will form the core of the extension.

* **Files to Potentially Remove:**
  * `bin/cli.js`
  * `src/index.js`, `src/bin/cli.js`
  * `build/script.js` (if using a different build system or none)
  * `tsconfig.json` (if not using TypeScript)
  * Node-specific parts of `package.json` if not using Node.js for building
    (e.g. `exports`, `main`, `module`).
  * GitHub Actions for `test.yml` will need to be adapted if you implement
    automated browser extension testing (which can be complex).
    Linting/formatting workflows can be kept.

* **Loading & Publishing:**
  * Load the extension unpacked (pointing to your `dist` or source directory) in
    your browser during development.
  * Package as a `.zip` file for publishing to stores like the Chrome Web Store,
    Firefox Add-ons, etc.

Refer to the documentation for your target browser(s) (e.g.,
[Chrome Extensions](https://developer.chrome.com/docs/extensions/)
,
[Firefox Browser Extensions](<https://developer.mozilla.org/en-US/docs/Mozilla/Ad>
d-ons/WebExtensions)).

### VSCode Theme

VSCode Themes are much simpler in terms of code and primarily involve creating
JSON definition files.

* **Key Files & `package.json`:**
  * `package.json` is still essential:
    * `name`, `displayName`, `description`, `publisher`, `version` are similar to VSCode Extensions.
    * `engines.vscode` is required.
    * The most important part is `contributes.themes`. This is an array where you define your theme(s):

            ```json
            "contributes": {
              "themes": [
                {
                  "label": "My Awesome Theme", // Name shown in theme picker
                  "uiTheme": "vs-dark", // or "vs" for light, "hc-black" for high contrast
                  "path": "./themes/my-awesome-theme.json" // Path to your theme definition file
                }
              ]
            }
            ```

  * Theme definition JSON file(s) (e.g., `themes/my-awesome-theme.json`). This
    file specifies colors for various parts of the VSCode UI and syntax
    highlighting tokens.

* **Source Code:**
  * The primary "source" will be your theme JSON file(s).
  * You typically won't need much, if any, JavaScript. So, `src/`, `test/`,
    `build/script.js`, `tsconfig.json`, and Biome configurations can often be
    removed.
  * You might keep a `scripts/` directory if you plan to generate your theme
    JSON from other formats (e.g., using JavaScript to process color palettes).

* **Files to Potentially Remove:**
  * `src/` (entire directory)
  * `test/` (entire directory)
  * `bin/` (entire directory)
  * `build/script.js`
  * `tsconfig.json`
  * `.npmrc`, `.nvmrc` (unless you have build scripts using Node.js)
  * Biome configuration (`.github/configs/biome.json`) and related linting in
    GitHub Actions if no JS/TS is present.
  * The `test.yml` workflow in GitHub Actions (unless you have scripts to test
    theme generation).
  * Many `devDependencies` in `package.json` related to TypeScript, testing, and
    bundling.

* **Structure:**
  * A `themes/` directory in your project root is conventional for storing your
    theme JSON files.

* **Publishing:**
  * Use `vsce package` and `vsce publish` as with VSCode Extensions.

Refer to the official
[VSCode Theme API documentation](<https://code.visualstudio.com/api/extension-gui>
des/color-theme) for details on creating theme files.

### NPM Library / Package

This template is already well-suited for creating a Node.js-based NPM library or
package.

* **Key Files & `package.json`:**
  * `package.json` is central. Pay close attention to:
    * `name`: The unique name of your package on NPM (e.g., `my-npm-package`).
    * `version`: Follow semantic versioning (e.g., `0.1.0`).
    * `description`: A clear description of what your library does.
    * `main`: Entry point for CommonJS environments (e.g., `dist/index.cjs.js`). The template defaults to this.
    * `module`: Entry point for ES Module environments (e.g., `dist/index.esm.js`). The template defaults to this.
    * `types` (if using TypeScript): Points to your main declaration file (e.g., `dist/index.d.ts`). The template defaults to this.
    * `exports`: (Recommended for modern packages) Defines module entry points for different environments and conditions. The template has a basic setup for this.
    * `files`: An array of files/folders to include when your package is published (e.g., `["dist", "src", "README.md", "LICENSE"]`). The template has a good default.
    * `keywords`: Relevant keywords for discoverability on NPM.
    * `author`: Your name and email.
    * `license`: (e.g., `MIT`). Ensure the `LICENSE` file matches.
    * `repository`: URL to your Git repository.
    * `bugs`: URL to your issue tracker.
    * `homepage`: URL to the project's homepage.
    * `publishConfig`: (e.g., `{"access": "public"}`). The template defaults to public access.
    * `scripts`: For building, testing, linting, formatting. The template provides robust examples.
    * `dependencies` vs `devDependencies` vs `peerDependencies`: Understand their differences and use them appropriately.
  * `src/index.js` (or `src/index.ts` if you convert to TypeScript) will be your
    library's main entry point.
  * `tsconfig.json` is provided for TypeScript users. If you're not using
    TypeScript, you can remove this and adjust build scripts.
  * `.npmrc` and `.nvmrc` help standardize the Node.js/NPM environment.

* **Source Code:**
  * Develop your library's code within the `src/` directory.
  * Write unit tests in the `test/` directory. The template provides example
    test files (`test/index.test.js`, `test/cli.test.js`).

* **Build Process:**
  * The template's `build/script.js` is an example of a custom build script. You
    might replace this with tools like Rollup, esbuild, Webpack, or simply `tsc`
    if using TypeScript.
  * Ensure your `package.json` `build` script correctly compiles/bundles your
    code into the `dist/` directory (or as configured in `files` and entry point
    fields).

* **Files to Potentially Remove:**
  * `bin/cli.js` and its test `test/cli.test.js` if your library doesn't provide
    a Command Line Interface. If so, also remove the `bin` field from
    `package.json`.
  * The example `docs/` content if your documentation will be elsewhere (e.g.,
    just the README or a separate site).

* **Best Practices:**
  * Keep all the linting, formatting, testing, and CI workflows
    (`.github/workflows/`) provided by the template. They promote code quality
    and maintainability.
  * Generate and maintain a `CHANGELOG.md`. The `changelog.yml` workflow can
    help automate this.

* **Publishing:**
  * Use `npm publish` after building and testing thoroughly. Ensure you are
    logged into NPM (`npm login`).

This project type requires the least modification from the base template if your
library is Node.js based.

### Node.js Project (CLI, Backend Server, etc.)

The template is an excellent starting point for various Node.js projects,
including Command Line Interface (CLI) tools or backend services (e.g.,
Express.js web server).

* **General Setup:**
  * Most of the template's structure and configuration (`package.json`, `src/`,
    `test/`, `.github/workflows`, linting, formatting, `.nvmrc`, `.npmrc`) can
    be used directly.
  * Update `package.json` with your project's specific `name`, `version`,
    `description`, `author`, etc.
  * If the project is not intended to be a library, you might set `private:
    true` in `package.json` and remove fields like `publishConfig`, `main`,
    `module`, `exports` if they are not relevant. However, `main` can still be
    useful to indicate the primary entry script.

* **For a CLI Tool:**
  * **`package.json`:**
    * The `bin` field is key. The template has an example: `"bin": { "gst": "./bin/cli.js" }`. Rename `gst` to your desired command and ensure the path points to your CLI entry script.
    * `dependencies` should include any packages your CLI relies on (e.g., `yargs` for argument parsing).
  * **Source Code:**
    * The template provides `bin/cli.js` and `src/bin/cli.js` (if `src` is compiled to `bin`). This is a good place for your CLI entry point.
    * `src/index.js` might contain core logic imported by your CLI script, or it could be removed if all logic is within the CLI script(s).
  * **Installation:** Users can install your CLI globally (`npm install -g .`)
    or run it directly using `npx`.

* **For a Backend Server (e.g., Express.js):**
  * **`package.json`:**
    * `dependencies` will include your web framework (e.g., `express`) and other necessary packages (e.g., database clients, ORMs).
    * The `scripts.start` command would typically be `node src/server.js` or similar, pointing to your server's entry point.
  * **Source Code:**
    * Your main server entry point might be `src/index.js`, `src/server.js`, or `src/app.js`.
    * You'd structure your routes, controllers, models, services, etc., within the `src/` directory.
  * **Files to Potentially Remove:**
    * `bin/cli.js` and `test/cli.test.js` if your project is purely a backend server without a CLI component. Also remove the `bin` field from `package.json`.
    * The template's `build/script.js` might be adapted or replaced depending on your build needs (e.g., transpiling TypeScript, bundling). For many Node.js backend projects that use JavaScript directly, a complex build step might not be necessary beyond `tsc` if using TypeScript.

* **Testing:**
  * Adapt `test/` to include unit and integration tests relevant to your CLI or
    backend logic. The existing test setup (`c8` for coverage, `node --test`)
    can be a good foundation.

* **Workflows & Tooling:**
  * All GitHub Actions workflows (linting, formatting, testing, CodeQL,
    changelog) are generally beneficial and can be kept with minor adjustments
    to test scripts or build steps as needed.

This type of project leverages most of the template's strengths directly.

### Static Project (Website, Documentation Site)

If your project is a static website (plain HTML, CSS, JavaScript) or a
documentation site that doesn't require a complex Node.js build system:

* **Core Files:**
  * Your primary content will be HTML, CSS, and client-side JavaScript files.
  * These can reside in the root directory (e.g., `index.html`), or often
    better, within a dedicated folder like `docs/` (which the template already
    has) or `public/`.
  * The template's existing `docs/index.html` can serve as a starting
    placeholder.

* **`package.json` (Optional):**
  * You might not need a `package.json` at all if you have no build steps or
    development dependencies.
  * If you do use it, it would be for:
    * `devDependencies`: Like a simple HTTP server for local development (e.g., `live-server`, `http-server`), or linters for HTML/CSS/JS.
    * `scripts`: For running the local server, or simple build/lint tasks.
    * Example: `"scripts": { "dev": "live-server docs/" }`
  * If you keep `package.json`, set `private: true`.

* **Files to Potentially Remove:**
  * Most Node.js-specific files and configurations can be removed:
    * `src/` (entire directory)
    * `test/` (unless writing client-side JS unit tests)
    * `bin/` (entire directory)
    * `build/` (entire directory, unless you implement a static site generator build step)
    * `tsconfig.json`
    * `.npmrc`, `.nvmrc`
    * `package-lock.json` (if `package.json` is removed or heavily stripped)
    * Biome configuration (`.github/configs/biome.json`) and its related GitHub Actions steps if no JS/TS is being linted through it. You might use other linters for HTML/CSS.
    * Many fields from `package.json` if you keep it (e.g., `main`, `module`, `exports`, `bin`, `dependencies` unless specifically for a static site generator).
  * Review GitHub Actions (`.github/workflows/`):
    * `test.yml` might be removed or adapted if you have HTML/CSS/JS linters.
    * `format.yml` might be adapted for HTML/CSS formatting.
    * `codeql.yml` might still be useful if you have client-side JavaScript.
    * Workflows related to Node.js builds or NPM publishing are not needed.
    * You might add a workflow to deploy your static site to services like GitHub Pages, Netlify, Vercel, etc.

* **VSCode & Editor Settings:**
  * `.vscode/settings.json` and `.vscode/extensions.json` can still be useful
    for recommending HTML, CSS, and JavaScript linters/formatters (e.g.,
    Prettier, ESLint for client-side JS).
  * `.editorconfig` remains useful for basic code style consistency.

* **Deployment:**
  * Static sites are easily deployed to various hosting platforms. GitHub Pages
    is a common choice for projects hosted on GitHub and can be configured to
    serve from the `docs/` folder or a specific branch.

This adaptation involves stripping down the template considerably to its core
Git repository best practices and potentially adding static site specific
tooling.

## Contributing

Contributions to improve this template are welcome! Please see the
[CONTRIBUTING.md](.github/CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the terms of the [MIT License](LICENSE).
