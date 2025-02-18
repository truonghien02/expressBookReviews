const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status("400").send("Username and Password are required!");
  } else if (isValid(username)) {
    users.push({ username, password });
    res.send(username + " has been registered");
  } else {
    res.status(409).send(username + " already exist");
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
  }).then(() => {
    res.send(JSON.stringify(books, null, 4));
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) {
      resolve(book);
    } else {
      reject();
    }
  })
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(400).send("Book not found!");
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(({ author }) =>
      author.toLowerCase().includes(req.params.author.toLowerCase())
    );
    resolve(result ?? []);
  }).then((data) => {
    res.send(data);
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(({ title }) =>
      title.toLowerCase().includes(req.params.title.toLowerCase())
    );
    resolve(result ?? []);
  }).then((data) => {
    res.send(data);
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    res.send(book.reviews);
  } else {
    res.status(400).send("Book not found!");
  }
});

module.exports.general = public_users;
