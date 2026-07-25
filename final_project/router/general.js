const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
	const {username, password} = req.body;

	if (username === '' || password === '' || !isValid(username)){
		return res.send('Username is invalid');
	}

	users.push({username, password});
	return res.send('User Registered');
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	return res.send(JSON.stringify(books));
});

public_users.get('/task10', async function (req, res) {
	const result = await axios.get('https://gareth12345-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
	return res.send(result.data);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
	const {isbn} = req.params;
	const items = Object.entries(books);
	const filtered = items.filter(item => item[0] === isbn);
	return res.send(filtered);
});

public_users.get('/task11', async function (req, res) {
	const result = await axios.get('https://gareth12345-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/3');
	return res.send(result.data);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
	const {author} = req.params;
	const filtered = Object.entries(books).filter(
		([key, value]) => value.author === author
	);

	const results = filtered.map(([key, value]) => ({
			isbn: key,
			...value
		})
	)

	if (results.length === 0) {
		return res.status(404).send({"message": "No books found with that author name"});
	}

	return res.send(results);
});

public_users.get('/task12', async function (req, res) {
	const result = await axios.get('https://gareth12345-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/Unknown');
	return res.send(result.data);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
	const {title} = req.params;
	const items = Object.entries(books);
	const filtered = items.filter(item => item[1].title === title);
	return res.send(filtered);
});


public_users.get('/task13', async function (req, res) {
	const result = await axios.get('https://gareth12345-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/The Epic Of Gilgamesh');
	return res.send(result.data);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	const {isbn} = req.params;
	const items = Object.entries(books);
	const filtered = items.filter(item => item[0] === isbn);
	return res.send(filtered[0][1].reviews);
});

module.exports.general = public_users;
