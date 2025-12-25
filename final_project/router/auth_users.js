const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();
const secretKey = require('../secret-key.js');

let users = [];

const isValid = (username) => {
  const userFound = users.find((user) => user.username === username);

  if (userFound) return true;
  return false;
};

const authenticatedUser = (username, password) => {
  const userFound = users.find(
    (user) => user.username === username && user.password === password
  );

  if (userFound) return true;
  return false;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(404)
      .json({ message: 'Error logging in: missing user name' });
  }

  if (!password) {
    return res
      .status(404)
      .json({ message: 'Error logging in: missing password' });
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
    const decoded = jwt.decode(token, secretKey);

    if (!decoded) {
      return res
        .status(403)
        .json({ message: 'Error logging in: invalid token' });
    }

    return res
      .status(200)
      .json({
        message: `Hello ${decoded.username}, you are successfully logged in`
      });
  }

  return res
    .status(208)
    .json({ message: 'Invalid Login. Check username and password' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
