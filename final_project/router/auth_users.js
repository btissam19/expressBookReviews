const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let accessToken;

const isValid = (username)=>{ 
  const existingusers=users.filter((user)=>{
    return user.username===username
  })
   if(existingusers.length===0) return true
   else return false
}

const authenticatedUser = (username,password)=>{ 
  let valideUser=users.filter((user)=>{ return (user.username === username && user.password === password)})
  if(valideUser.length!==0) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  console.log(users)
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  console.log(req.session)
    return res.status(200).json({ message: "You are successfully logged in"});
  }
  return res.status(401).json({ message: "You are not authenticated" });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  if (isbn > 10 || isbn < 1) {
    return res.status(300).json({ message: "We don't find the book with this ISBN" });
  }
  isbn = String(isbn);
  for (let book in books) {
    if (book === isbn) {
      let newReview = req.body.review;
      books[book].reviews = newReview;
      console.log(books)
      return res.status(200).json({ message: `Review for the book with ISBN ${isbn} has been added/updated` });
    }
  }
  return res.status(409).json({ message: `The book with ISBN ${isbn} not found` });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  if (isbn > 10 || isbn < 1) {
    return res.status(300).json({ message: "We don't find the book with this ISBN" });
  }
  isbn = String(isbn);
  for (let book in books) {
    if (book === isbn) {
      let username=req.session.authorization['username']
      books[book].reviews ="";
      console.log(books)
      return res.status(200).json({ message: `Review for the book with ISBN ${isbn} has been deleted by the user ${username}` });
    }
  }
  return res.status(409).json({ message: `The book with ISBN ${isbn} not found` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.accessToken=accessToken;

