const fs = require("fs");
const pool = require("./pool");

const sqlFromFile = (fileName) => {
  // Extract SQL queries from files. Assumes no ';' in the fileNames
  var queries = fs
    .readFileSync(fileName)
    .toString()
    .replace(/--.*/g, "") // Remove comments
    .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
    .replace(/\s+/g, " ") // excess white space
    .split(";") // split into all statements
    .map(Function.prototype.call, String.prototype.trim)
    .filter((el) => el.length != 0); // remove any empty ones

  pool
    .connect()
    .then(async (client) => {
      // Execute each SQL query sequentially
      for (let i = 0; i < queries.length; i++) {
        await client.query(queries[i]);
        console.log(`[SQL ${fileName}#${i + 1}]: ${queries[i]}`);
      }
      client.release();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

module.exports = sqlFromFile;
