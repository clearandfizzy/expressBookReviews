const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
	const {username, password} = req.body;

	if (username === '' || password === '' || !isValid(username)){
		res.send('Username is invalid');
	}

	users.push({username, password});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
	const {isbn} = req.params;
	const items = Object.entries(books);
	const filtered = items.filter(item => item[0] === isbn);
	return res.send(filtered);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
	const {author} = req.params;
	const items = Object.entries(books);
	const filtered = items.filter(item => item[1].author === author);
	return res.send(filtered);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
	const {title} = req.params;
	const items = Object.entries(books);
	const filtered = items.filter(item => item[1].title === title);
	return res.send(filtered);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	const {isbn} = req.params;
	const items = Object.entries(books);
	const filtered = items.filter(item => item[0] === isbn);
	return res.send(filtered[0][1].reviews);
});

module.exports.general = public_users;
