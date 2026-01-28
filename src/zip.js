//File for how to zip using paths

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Grab directory paths
const currentPath = path.resolve();
// console.log('currentPath', currentPath);
const filesDir = path.resolve(currentPath, 'files');
// console.log('filesDir', filesDir);
const zippedDir = path.resolve(currentPath, 'zipped');
// console.log('zippedDir', zippedDir);

const zipFile = path.join(zippedDir, 'text.zip');

// Proof of concept: If zippedDir doesn't exist, make one
if (!fs.existsSync(zippedDir)) {
  fs.mkdirSync(zippedDir);
}

let zipCommand;

//If windows, use this command (only works in power shell)
//DO NOT USE SPACE IN PATH, WILL BREAK THINGS
if (process.platform === 'win32') {
  //Path.sep adds a backslash or whatever delimiter is used for pathing, dependent on OS
  zipCommand = `powershell Compress-Archive -Path ${filesDir + path.sep}* -DestinationPath ${zipFile}`;
} else {
  zipCommand = `zip ${zipFile} ${filesDir}/*`;
}
console.log(zipCommand);

//1st param: command to execute, 2 param is standard output or errors
//1st error reps anything wrong on nodes end, stderr on command you are executing end
exec(zipCommand, (error, stdout, stderr) => {
  if (error) {
    console.log('error', error.message);
  }
  if (stderr) {
    console.log('stderror', stderr);
  }
  if (error || stderr) {
    return;
  }

  console.log(stdout);
});
