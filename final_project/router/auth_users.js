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
		return res.send('Invalid Credentials');
	}

	let accessToken = jwt.sign({
		data: username
	}, 'access', { expiresIn: 60 * 60 });

	req.session.authorization = {
		accessToken, username
	};
	return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const {isbn} = req.params;
	const {review} = req.body;
	const username = req.user.data;

	const items = Object.entries(books);
	const filtered = items.filter(item => item[0] === isbn);

	if (filtered.length < 1) {
		res.send('ISBN not found');
	}

	let reviews = Object.entries(books[isbn].reviews);
	let filtered_reviews = reviews.filter(item => item[1].username === username);

	if (filtered_reviews.length  === 0) {
		const reviewLength = books[isbn].reviews.length ?? 0;
		books[isbn].reviews[reviewLength] =  {username, review};
		return res.send('Review Added');
	}

	const key = filtered_reviews[0][0];
	books[isbn].reviews[key] = {username, review};
	return res.send('Review Updated');

});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
	const {isbn} = req.params;
	const username = req.user.data;

	const entry = Object.entries(books[isbn].reviews).find(
		([, item]) => item.username === username
	);

	if (entry.length > 0) {
		const [key] = entry;
		delete books[isbn].reviews[key];
		return res.send('Book review deleted');
	}

	return res.send('No review to Delete');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
