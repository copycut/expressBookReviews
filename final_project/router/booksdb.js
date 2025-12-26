const axios = require('axios').default;

// Simulate asynchronous retrieval of books with axios from a remote JSON file
function fetchBooks() {
  return axios
    .get(
      'https://raw.githubusercontent.com/copycut/expressBookReviews/refs/heads/main/final_project/router/books.json?raw=true'
    )
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching books:', error);
      return null;
    });
}

module.exports.fetchBooks = fetchBooks;
