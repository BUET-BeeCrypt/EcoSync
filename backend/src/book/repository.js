const pool = require("../db/pool");

// use await pool.query to run SQL queries
/*
CREATE TABLE public.books (
    id int PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL
);
*/

const getAllBooks = async () => {
    const query = "SELECT * FROM books";
    const result = await pool.query(query);
    return result.rows;
}

const getBookById = async (id) => {
    const query = "SELECT * FROM books WHERE id = $1";
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
        throw new Error("Book not found");
    }
    return result.rows[0];
}

const createBook = async (book) => {
    const query = "INSERT INTO books (id, title, author, genre, price) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const result = await pool.query(query, [book.id, book.title, book.author, book.genre, book.price]);
    if (result.rows.length === 0) {
        throw new Error("Book not created");
    }
    return result.rows[0];
}

const updateBook = async (id, book) => {
    const query = "UPDATE books SET title = $1, author = $2, genre = $3, price = $4 WHERE id = $5 RETURNING *";
    const result = await pool.query(query, [book.title, book.author, book.genre, book.price, id]);
    if (result.rows.length === 0) {
        throw new Error("Book not found");
    }
    return result.rows[0];
}

/*
/api/books?{search_field}={value}&sort={sorting_field}&order={sorting_order}
search fields = title, author, genre
sorting fields = title, author, genre, price
sorting fields secondary = id 
sorting order = asc, desc
*/

const searchBooks = async (searchField, searchValue, sortField, sortOrder) => {
    const query = `SELECT * FROM books WHERE ${searchField} = $1 ORDER BY ${sortField} ${sortOrder}, id ASC`;
    const result = await pool.query(query, [searchValue]);
    return result.rows;
}


const deleteBook = async (id) => {
    const query = "DELETE FROM books WHERE id = $1";
    await pool.query(query, [id]);
}

module.exports = {
    getAllBooks,
    searchBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
}