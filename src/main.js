// Without ECMA
// const { exec } = require('child_process');

// With ECMA
import { exec } from 'child_process';
import open, { apps } from 'open';
import dotenv from 'dotenv';

dotenv.config();

// Returns command line argument given in the terminal in an array
// console.log(process.argv);

// Removes "npm run start" and keeps an array of other command the user inputs
// useful for navigating/shortcuts
const args = process.argv.slice(2);
// console.log(args);

const command = args[0];
const favorite = args[1];
const url = args[2];

function checkBrowser() {
  // Remember question mark means if any of these throw undefined, do not crash system, instead throw error
  const browser = process.env?.BROWSER?.toLocaleLowerCase();
  let appName = browser;
  console.log(appName);

  switch (browser) {
    case 'chrome':
      appName = apps.chrome;
      break;
    case 'firefox':
      appName = apps.firefox;
      break;
    case 'edge':
      appName = apps.edge;
      break;
  }
  return appName;
}

function displayMenu() {
  console.log('open <favorite>        : Open a saved favorite');
  console.log('add <favorite> <url>   : add a new favorite for some URL');
  console.log('rm <favorite>          : remove a saved favorite.');
}

async function openFavorite(favorite) {
  console.log('Opening', favorite);
  let url;
  if (favorite === 'goog') {
    url = 'https://google.com';
  } else if (favorite === 'social') {
    url = 'https://instagram.com';
  } else if (favorite === 'code') {
    url = 'https://leetcode.com';
  } else {
    console.log(`shortcut ${favorite} does not exist`);
    return;
  }

  // let command;

  // Without using import open

  // switch (process.platform) {
  //   case 'darwin':
  //     command = `open -a "Google Chrome" ${url}`;
  //     break;

  //   case 'win32':
  //     command = `start chrome ${url}`;
  //     break;

  //   case 'linux':
  //     command = `google-chrome ${url}`;
  //     break;

  //   default:
  //     console.log('Unsupported platform.');

  // }

  console.log('opening', url);
  const appName = checkBrowser();

  // If user doesn't provide a browser, open with default browser
  if (appName) {
    // Without await keyword, will not open browser
    // wait: true prevents the code from continuting if not done
    await open(url, { wait: true, app: { name: appName } });
  } else {
    await open(url, { wait: true });
  }
}

function add(favorite, url) {
  console.log('adding', favorite, url);
}

function rm(favorite) {
  console.log('rm', favorite);
}

// Environmental variables - grab environment variable I write in terminal after process.env.envVarName
// In this case, i wrote "BROWSER=chrome npm run start open social"
// This was moved to checkBrowser section

// const browser = process.env.BROWSER;
// console.log('Opening with', browser);

// Prints help menu
if (!command || !favorite || command === 'help') {
  displayMenu();
} else {
  switch (command) {
    case 'open':
      openFavorite(favorite);
      break;
    case 'add':
      if (!url) {
        displayMenu();
        break;
      }
      add(favorite, url);
      break;
    case 'rm':
      rm(favorite);
  }
}
