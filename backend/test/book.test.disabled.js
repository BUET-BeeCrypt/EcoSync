const api = require("./api/book");

const books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    price: 19.99,
  },
  {
    id: 2,
    title: "Go Set a Watchman",
    author: "Harper Lee",
    genre: "Drama",
    price: 24.99,
  },
  {
    id: 3,
    title: "To Kill a Mockingbird: A Graphic Novel",
    author: "Harper Lee",
    genre: "Graphic Novel",
    price: 14.99,
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    price: 29.99,
  },
  {
    id: 5,
    title: "Sense and Sensibility",
    author: "Jane Austen",
    genre: "Romance",
    price: 17.99,
  },
  {
    id: 6,
    title: "Emma",
    author: "Jane Austen",
    genre: "Romance",
    price: 22.99,
  },
  {
    id: 7,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    price: 12.99,
  },
  {
    id: 8,
    title: "Tender Is the Night",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    price: 27.99,
  },
  {
    id: 9,
    title: "This Side of Paradise",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    price: 21.99,
  },
  {
    id: 10,
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Science Fiction",
    price: 18.99,
  },
  {
    id: 11,
    title: "Island",
    author: "Aldous Huxley",
    genre: "Science Fiction",
    price: 16.99,
  },
  {
    id: 12,
    title: "The Doors of Perception",
    author: "Aldous Huxley",
    genre: "Science Fiction",
    price: 25.99,
  },
  {
    id: 13,
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    genre: "Psychological Thriller",
    price: 23.99,
  },
  {
    id: 14,
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    genre: "Psychological Thriller",
    price: 31.99,
  },
  {
    id: 15,
    title: "Demons",
    author: "Fyodor Dostoevsky",
    genre: "Psychological Thriller",
    price: 20.99,
  },
];

describe("Book Endpoint", () => {
  it("should return an empty array", async () => {
    const response = await api.getAllBooks();
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ books: [] });
  });

  it("not found book", async () => {
    const response = await api.getBookById(1);
    expect(response.status).toBe(404);
    expect(response.data).toEqual({ message: "book with id: 1 was not found" });
  });

  books.forEach((book) => {
    it(`should create book ${book.title}`, async () => {
      const response = await api.createBook(book);
      expect(response.status).toBe(201);
      expect(response.data).toEqual(book);
    });
  });

  it("should return all books", async () => {
    const response = await api.getAllBooks();
    // expect(response).toBeNull();
    expect(response.status).toBe(200);
    expect(response.data).toEqual({books: books});
  });

  it("should return book by id", async () => {
    const response = await api.getBookById(1);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(books[0]);
  });

  it("should only return Romance books sorted by author", async () => {
    const response = await api.searchBooks({
      genre: "Romance",
      sort: "author",
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ books: [books[3], books[4], books[5]] });
  });

  it("should only return books titled 'Demons'", async () => {
    const response = await api.searchBooks({
      title: "Demons",
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ books: [books[14]] });
  });

  it("should sort books by genre in descending order", async () => {
    const response = await api.searchBooks({
      sort: "genre",
      order: "desc",
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      books: [
        books[9],
        books[10],
        books[11],
        books[3],
        books[4],
        books[5],
        books[12],
        books[13],
        books[14],
        books[2],
        books[0],
        books[1],
        books[6],
        books[7],
        books[8],
      ],
    });
  });

  it("should not update not found book", async () => {
    const response = await api.updateBook(25, {
      id: 25,
      title: "The Idiot",
      author: "Fyodor Dostoevsky",
      genre: "Psychological Thriller",
      price: 23.99,
    });
    expect(response.status).toBe(404);
    expect(response.data).toEqual({
      message: "book with id: 25 was not found",
    });
  });

  it("should update book", async () => {
    const book = {
      id: 10,
      title: "Brave New World",
      author: "Aldous Huxley",
      genre: "Science Fiction",
      price: 19.99,
    };
    const response = await api.updateBook(10, book);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(book);
    books[9] = book;
  });

  it("should only return books by Aldous Huxley sorted by title in descending order", async () => {
    const response = await api.searchBooks({
      author: "Aldous Huxley",
      sort: "title",
      order: "DESC",
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ books: [books[11], books[10], books[9]] });
  });
});
