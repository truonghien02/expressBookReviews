const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  const user = users.find((user) => username === user.username);
  return !user;
};

const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.json({ message: "User successfully logged in", accessToken });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const bookReviews = books[req.params.isbn].reviews;
  bookReviews[username] = req.body.reviews;
  res.send("The review has been updated");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const bookReviews = books[req.params.isbn].reviews;
  delete bookReviews[username];
  books[req.params.isbn].reviews = bookReviews;
  res.send("The review has been deleted");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
