
-- Table definition
-- Table: public.books
-- Columns:
--  id: integer
--  title: character varying
--  author: character varying
--  genre: character varying
--  price: float 

CREATE TABLE IF NOT EXISTS public.books (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    price FLOAT NOT NULL
);

-- Insert data
-- INSERT INTO public.books (title, author, genre, price) VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 9.99);
-- INSERT INTO public.books (title, author, genre, price) VALUES ('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 9.99);

-- Select data
-- SELECT * FROM public.books;

-- 


