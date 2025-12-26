const express = require('express');
let getBooks = require('./booksdb.js').getBooks;
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const books = await getBooks();
  res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const books = await getBooks();
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const cleanAuthor = decodeURIComponent(author);
  const books = await getBooks();
  const results = [];

  for (const isbn in books) {
    if (books[isbn]?.author?.toLowerCase() === cleanAuthor.toLowerCase()) {
      results.push(books[isbn]);
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: 'No books found by that author' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const cleanTitle = decodeURIComponent(title);
  const books = await getBooks();
  const results = [];

  for (const isbn in books) {
    if (books[isbn].title.toLowerCase() === cleanTitle.toLowerCase()) {
      results.push(books[isbn]);
    }
  }

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: 'No books found with that title' });
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const books = await getBooks();
  const book = books[isbn];

  if (book?.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: 'No reviews found for this book' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.general = public_users;
