const { exec } = require('child_process');
const path = require('path');

const currentPath = path.resolve();
const srcPath = path.join(currentPath, 'src');
const buildDir = path.join(srcPath, 'build');
const mainExe = path.join(buildDir, 'main.exe');
// console.log(buildDir);

const arg = process.argv[2];
let command = `${mainExe}`;
console.log(command);

// If user input argument, add to command
if (arg) {
  command = command + ' ' + arg;
}

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.log('error code:', error.code);
  }
  if (stderr) {
    console.log('stderr:', stderr);
  }
  if (error || stderr) {
    return;
  }

  console.log(stdout);
});
