const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const filtered = users.filter(item => item.username === username);
  return (filtered.length < 1);
}

const authenticatedUser = (username,password) => {
  const filtered = users.filter(item => (item.username === username && item.password === password));
  return filtered.length === 1;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if (!authenticatedUser(username, password)) {
    res.send('Invalid Credentials');
  }

  const token = jwt.sign({
    data: 'access'
  }, 'secret', { expiresIn: 60 * 60 });

  res.send('User signed in');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const {review} = req.body;

  const items = Object.entries(books);
  const filtered = items.filter(item => item[0] === isbn);

  if (filtered.length < 1) {
    res.send('ISBN not found');
  }

  console.log(filtered[0][1]);

  const book  = filtered[0][1];
  let reviews = book.reviews.filter(item => item.username !== username);
  reviews.push({username: '', review});
  books[isbn].reviews = reviews;

  console.log(books);

  res.send('Review Added');

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
