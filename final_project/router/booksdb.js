const axios = require('axios').default;

// Simulate asynchronous retrieval of books with axios from a remote JSON file
function fetchBooks() {
  return axios
    .get(
      'https://github.com/copycut/expressBookReviews/blob/assignment/final_project/router/books.json?raw=true'
    )
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching books:', error);
      return null;
    });
}

module.exports.fetchBooks = fetchBooks;
