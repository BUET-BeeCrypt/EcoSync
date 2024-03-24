require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const pool = require('./src/pool');
const app = express();

app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(express.json());


const BOOK_TABLE = `
CREATE TABLE IF NOT EXISTS public.books (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    price FLOAT NOT NULL
);`

pool.query(BOOK_TABLE)
    .then(() => console.log("Table created successfully"))
    .catch((error) => console.log(error));

app.get("/", (req, res) => {
    res.json({
        message: "API is working"
    });
});

app.use("/api", require("./src/route"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;