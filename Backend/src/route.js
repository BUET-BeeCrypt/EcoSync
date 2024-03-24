const { addBook, editBook, getBook, getBooks } = require('./controller');

const router = require('express-promise-router')();

router.post("/books", addBook);
router.put("/books/:id", editBook);
router.get("/books/:id", getBook);
router.get("/books", getBooks);

module.exports = router;