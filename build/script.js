#!/usr/bin/env node
/**
 * Build script for generating different module formats and types bundle
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

// Create dist directory if it doesn't exist
const distDir = path.join(rootDir, 'dist')
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

// Create bin directory in dist if it doesn't exist
const distBinDir = path.join(distDir, 'bin')
if (!fs.existsSync(distBinDir)) {
  fs.mkdirSync(distBinDir, { recursive: true })
}

// Read package.json to get configuration
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))

// Run TypeScript compiler to generate declaration files
console.log('Running TypeScript compiler to generate declarations...')
execSync('tsc --declaration --emitDeclarationOnly', { stdio: 'inherit' })

// Create a single types.d.ts file
console.log('Bundling type declarations...')
const indexDtsPath = path.join(distDir, 'index.d.ts')
const typesDtsPath = path.join(distDir, 'types.d.ts')

if (fs.existsSync(indexDtsPath)) {
  // Read the content of index.d.ts
  const indexDtsContent = fs.readFileSync(indexDtsPath, 'utf8')

  // Create a types.d.ts with export * from the main module
  const typesDtsContent = `/**
 * Type definitions for ${packageJson.name}
 * Generated on ${new Date().toISOString()}
 */

${indexDtsContent}

// Export CLI types if available
declare module '${packageJson.name}/bin/cli' {
  const cli: any;
  export default cli;
}
`
  fs.writeFileSync(typesDtsPath, typesDtsContent)
  console.log(`Created ${typesDtsPath}`)
}

// Create the main module formats
console.log('Creating module formats...')

// Read source files
const indexSrc = fs.readFileSync(path.join(rootDir, 'src', 'index.js'), 'utf8')
const cliSrc = fs.readFileSync(path.join(rootDir, 'src', 'bin', 'cli.js'), 'utf8')

// Create CommonJS version (index.cjs.js)
// Use a more robust approach to convert ESM to CommonJS
const cjsContent = `'use strict';

// Convert ESM to CommonJS in a more robust way
const exportedModule = (() => {
  // Temporary exports object to capture named exports
  const exports = {};

  // Execute the module code in this context
  ${indexSrc.replace(/export\s+default\s+/, 'exports.default = ')}

  // Return either the default export or the full exports object
  return exports.default || exports;
})();

module.exports = exportedModule;
`
fs.writeFileSync(path.join(distDir, 'index.cjs.js'), cjsContent)
console.log('Created index.cjs.js (CommonJS)')

// Create ESM version (index.esm.js)
fs.copyFileSync(path.join(rootDir, 'src', 'index.js'), path.join(distDir, 'index.esm.js'))
console.log('Created index.esm.js (ESM)')

// Create UMD version (index.umd.js)
const umdContent = `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.gitStarterTemplate = factory());
})(this, function () {
  'use strict';

  // Execute the module code and capture exports
  const exports = {};

  // Execute the module code in this context
  ${indexSrc.replace(/export\s+default\s+/, 'exports.default = ')}

  // Return either the default export or the full exports object
  return exports.default || exports;
});
`
fs.writeFileSync(path.join(distDir, 'index.umd.js'), umdContent)
console.log('Created index.umd.js (UMD)')

// Create CLI executable script
const binContent = `#!/usr/bin/env node

${cliSrc}
`
fs.writeFileSync(path.join(distBinDir, 'cli.js'), binContent)
// Make CLI executable
fs.chmodSync(path.join(distBinDir, 'cli.js'), '755')
console.log('Created executable bin/cli.js')

// Create the CLI in bin directory
const binDir = path.join(rootDir, 'bin')
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true })
}

// Create CLI wrapper in bin directory
const cliWrapper = `#!/usr/bin/env node

import('../dist/bin/cli.js').catch(err => {
  console.error('Error importing CLI:', err);
  process.exit(1);
});
`
fs.writeFileSync(path.join(binDir, 'cli.js'), cliWrapper)
fs.chmodSync(path.join(binDir, 'cli.js'), '755')
console.log('Created bin/cli.js wrapper for package usage')

console.log('Build completed successfully! ✅')
