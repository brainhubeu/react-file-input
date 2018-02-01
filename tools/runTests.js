const path = require('path');
const spawn = require('cross-spawn');

const s = `\\${path.sep}`;
const pattern = `test${s}[^${s}]+.+\\.spec\\.js$`;
const result = spawn.sync(
  path.normalize('./node_modules/.bin/jest'),
  [pattern, ...process.argv.slice(2)],
  { stdio: 'inherit' }
);

process.exit(result.status);
