// Without ECMA
// const { exec } = require('child_process');

// With ECMA
import { exec } from 'child_process';
import open, { apps } from 'open';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import fs from 'fs';

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

let db;
const dbPath = 'favorites.db';

function init() {
  console.log('Initializing database...');
  db = new Database(dbPath);

  const createTable = `
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL, 
      url TEXT NOT NULL
    )
  `;

  db.exec(createTable);

  const data = [
    { name: 'goog', url: 'https://google.com' },
    { name: 'social', url: 'https://instagram.com' },
    { name: 'code', url: 'https://leetcode.com' },
  ];

  const insertData = db.prepare(
    'INSERT INTO favorites (name, url) VALUES (?,?)',
  );

  data.forEach((favorite) => {
    insertData.run(favorite.name, favorite.url);
  });
}

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
  const row = db
    .prepare('SELECT * FROM favorites WHERE name = ?')
    .get(favorite);

  const url = row.url;

  console.log('Opening', favorite);

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

if (!fs.existsSync(dbPath)) {
  init();
} else {
  db = new Database(dbPath);
}

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
