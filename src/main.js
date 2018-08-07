const chalk = require('chalk').default;
const path = require('path');
const { spawnSync } = require('child_process');

function findNPMPath() {
  const result = spawnSync('where', ['npm']);

  const npmPaths = result.output[1].toString().split('\r\n');

  return npmPaths[1];
}

function npmOutdated(directory) {
  const npmPath = findNPMPath();

  const result = spawnSync(npmPath, ['outdated', '--json'], {
    cwd: directory,
  });

  return JSON.parse(result.output[1].toString());
}

const result = npmOutdated(path.resolve(process.argv[1], '..', '..', '..', '..'));

let exitCode = 0;

for (const packageName of Object.keys(result)) {
  const package = result[packageName];

  if (package.current === package.wanted) {
    continue;
  }

  console.log(`${chalk.red(package.wanted)} expected but found ${chalk.blue(package.current)} for ${packageName}`);

  exitCode = -1;
}

process.exit(exitCode);
