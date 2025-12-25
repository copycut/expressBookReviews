const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();
const secretKey = require('../secret-key.js');

let users = [];

const isValid = (username) => {
  const userWithSameName = users.filter((user) => user.username === username);
  return userWithSameName.length > 0;
};

const authenticatedUser = (username, password) => {
  const validUser = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validUser.length > 0;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(404)
      .json({ message: 'Error logging in: missing user name or password' });
  }

  if (!isValid(username)) {
    return res
      .status(208)
      .json({ message: 'Invalid Login. User not yet registered' });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username: username }, secretKey, {
      expiresIn: '1h'
    });

    req.session.authorization = { accessToken: token };

    return res.status(200).json({
      message: `Hello ${username}, you are successfully logged in`
    });
  }

  return res
    .status(208)
    .json({ message: 'Invalid Login. Check username and password' });
});

regd_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({
      message: 'Error registering user: missing user name or password'
    });
  }

  if (isValid(username)) {
    return res.status(208).json({
      message: 'User already exists! Please choose a different username'
    });
  }

  users.push({ username, password });

  return res.status(200).json({ message: 'User registered successfully.' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review, username } = req.body;
  let book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} not found.` });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;

  return res
    .status(200)
    .json({ message: `Review for the book with ISBN ${isbn} added/updated.` });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const token = req.session.authorization.accessToken;
  const decoded = jwt.verify(token, secretKey);

  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const username = decoded.username;

  let book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} not found.` });
  }

  // filter out the review by the user
  // reviews: { [userName]: review }
  const hasReviews = book.reviews && book.reviews.hasOwnProperty(username);

  if (hasReviews) {
    delete book.reviews[username];
    return res
      .status(200)
      .json({ message: `Review for the book with ISBN ${isbn} deleted.` });
  } else {
    return res
      .status(404)
      .json({ message: `No review by user ${username} found for deletion.` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
