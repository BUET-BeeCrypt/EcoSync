const baseApi = require('./_base');

const getAllBooks = async () => {
    return await baseApi.get('/books');
}

const getBookById = async (id) => {
    return await baseApi.get(`/books/${id}`);
}

const createBook = async (book) => {
    return await baseApi.post('/books', book);
}

const updateBook = async (id, book) => {
    return await baseApi.put(`/books/${id}`, book);
}

const searchBooks = async (queryParams = {}) => {
    return await baseApi.get('/books', { params: queryParams });
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    searchBooks,
}