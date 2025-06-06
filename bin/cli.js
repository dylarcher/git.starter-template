#!/usr/bin/env node

import('../dist/bin/cli.js').catch(err => {
  console.error('Error importing CLI:', err);
  process.exit(1);
});
