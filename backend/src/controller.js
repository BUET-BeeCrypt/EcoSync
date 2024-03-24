const { query } = require('express');
const {
    searchBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require('./repository');

const addBook = async (req, res) => {
    const book = req.body;

    // check if book.id is int
    if (isNaN(book.id)) {
        return res.status(400).json({
            message: "Invalid id"
        });
    }

    const createdBook = await createBook(book);
    res.status(201).json(createdBook);
};

const editBook = async (req, res) => {
    const id = req.params.id;
    const book = req.body;

    // check if book.id is int
    if (isNaN(id)) {
        return res.status(400).json({
            message: "Invalid id"
        });
    }

    const parsedId = parseInt(id);
    try {
        const updatedBook = await updateBook(parsedId, book);
        res.json(updatedBook);
    } catch (error) {
        res.status(404).json({
            message: `book with id: ${id} was not found`
        });
    }
}

const getBook = async (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({
            message: "Invalid id"
        });
    }

    const parsedId = parseInt(id);
    try {
        const book = await getBookById(parsedId);
        res.json(book);
    } catch (error) {
        res.status(404).json({
            message: `book with id: ${id} was not found`
        });
    }
}

/*
/api/books?{search_field}={value}&sort={sorting_field}&order={sorting_order}
search fields = title, author, genre
sorting fields = title, author, genre, price
sorting fields secondary = id 
sorting order = asc, desc
*/

const SEARCH_FIELDS = ["title", "author", "genre"];
const SORT_FIELDS = ["title", "author", "genre", "price"];
const SORT_ORDER = ["ASC", "DESC"];

const getBooks = async (req, res) => {
    let sortField =  "id";
    let sortOrder = req.query.order || "ASC";
    
    let searchField = 1;
    let searchValue = 1;

    SEARCH_FIELDS.forEach((field) => {
        if (req.query[field]) {
            searchField = field;
            searchValue = req.query[field];
        }
    })
    
    let books = [];

    if (SORT_FIELDS.includes(req.query.sort) && SORT_ORDER.includes(sortOrder.toUpperCase()))
        sortField = req.query.sort
    

    books = await searchBooks(searchField, searchValue, sortField, sortOrder);

    res.json({
        books
    });
}

module.exports = {
    addBook,
    editBook,
    getBook,
    getBooks
};