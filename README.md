# Your Project Title (e.g., enter-repository-namespace)

A brief description of your project. This starter template provides a foundation for building Node.js applications or libraries with TypeScript. It includes pre-configured linting, formatting, testing, and build processes.

## Getting Started

1.  **Use this template:**
    *   Click the "Use this template" button on the GitHub repository page.
    *   Alternatively, clone this repository: `git clone https://github.com/dylarcher/git.starter-template.git your-project-name`
    *   Navigate into your new project directory: `cd your-project-name`

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Update Project Name and Details:**
    *   Open `package.json`.
    *   Change the `name` field from `enter-repository-namespace` to your project's name (e.g., `my-awesome-library` or `my-cli-tool`).
    *   Update other fields like `description`, `author`, `repository.url`, `bugs.url`, and `homepage` as needed.
    *   Consider renaming the main export in `src/index.ts` if you changed the library name significantly.

## Available Scripts

This template comes with the following scripts pre-configured in `package.json`:

*   `npm run build`
    Builds the TypeScript source code into JavaScript in the `dist` directory. It creates ES Module (esm), CommonJS (cjs) versions, and type declaration files (.d.ts).

*   `npm run build:bin`
    An internal script used by `npm run build` to create an executable for the CLI tool (if applicable).

*   `npm run format`
    Formats the codebase using Biome (for TypeScript/JavaScript) and markdownlint-cli (for Markdown files).

*   `npm run lint`
    Lints the codebase using Biome (for TypeScript/JavaScript) and yaml-lint (for YAML files).

*   `npm run test`
    Runs the test suite using Node.js's built-in test runner and generates coverage reports using `c8`. (Note: Example test files `test/cli.test.js` and `test/index.test.js` need to be updated or converted to TypeScript if desired).

*   `npm run clean`
    Removes generated files and directories, including `dist`, `types`, `bin` (the generated one, not src/bin), and `node_modules`, `package-lock.json`.

*   `npm run clean:dist`
    Removes only the build output directories (`dist`, `types`, `bin`).

*   `npm run clean:libs`
    Removes `node_modules`, `package-lock.json`, and npm cache.

## Project Structure

A brief overview of the key directories and files:

```
.
├── .github/        # GitHub specific files (workflows, issue templates, etc.)
├── .vscode/        # VSCode editor specific settings (optional)
├── dist/           # Compiled output files (gitignored)
├── docs/           # Project documentation files
├── src/            # Source code (TypeScript files)
│   ├── bin/        # CLI related source code
│   │   └── cli.ts
│   └── index.ts    # Main library entry point
├── test/           # Test files
│   ├── cli.test.js # Example test for CLI (needs update/conversion to TS)
│   └── index.test.js # Example test for library (needs update/conversion to TS)
├── .editorconfig   # Editor configuration
├── .gitignore      # Files and directories to be ignored by Git
├── CHANGELOG.md    # Changelog for the project
├── LICENSE         # Project license file
├── package.json    # Project metadata and dependencies
├── README.md       # This file
└── tsconfig.json   # TypeScript compiler configuration (for ESM)
└── tsconfig.cjs.json # TypeScript compiler configuration (for CJS)
```

## Contributing

Refer to the `CONTRIBUTING.md` file for guidelines on how to contribute to this project.

## Code of Conduct

This project adheres to the `CODE_OF_CONDUCT.md`.

## License

This project is licensed under the terms of the `LICENSE` file.
