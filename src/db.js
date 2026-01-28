import Database from 'better-sqlite3';

// When not specifying a path in new Database('fileName.db'), *****it will be placed in the current directory node is being run from*****
const db = new Database('favorites.db');

const createTable = `
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL
  )
`;

// Creates table
db.exec(createTable);

// How to delete a table
// db.exec('DROP TABLE IF EXISTS favorites');

// ***** Best way to reset EVERYTHING is to delete favorites.db file *****

// Grab all tables in sqlite_master by their names, places tables  in an array

// const queryTables = "SELECT name FROM sqlite_master WHERE type='table'";
// const tables = db.prepare(queryTables).all();
// console.log(tables);

// ------------  Insert data -------------------
// Can do this way -- inserts 1 thing at a time
// const insertData = 'INSERT INTO favorites (name, url) VALUES (?, ?)';
// db.prepare(insertData).run('goog', 'https://google.com');

// Since db.prepare only needs to be prepped once, assign it to a var carrying the SQL statement
// prepare() compiles the SQL into binary computer code
const insertDataQuery = db.prepare(
  'INSERT INTO favorites (name, url) VALUES (?, ?)',
);

// Outputs everything in table
// console.log(db.prepare('SELECT * FROM favorites').all());

//Inserting multiple things at once
const data = [
  { name: 'social', url: 'https://instagram.com' },
  { name: 'news', url: 'https://google.com' },
];

// For each object in data, insert name and url
// data here represents our favorites hence why the param is named favorite
data.forEach((favorite) => {
  insertDataQuery.run(favorite.name, favorite.url);
});

//grabs all information
console.log(db.prepare('SELECT * FROM favorites WHERE name = ?').all());

// grab a piece of info -- grab url from favorites table where name is social
console.log(
  db.prepare('SELECT url FROM favorites WHERE name = ?').get('social').url,
);

// Remove
db.prepare('DELETE FROM favorites WHERE id =?').run('2');
