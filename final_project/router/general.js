const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  if(isbn>10||isbn<1) return res.status(300).json({message: "we don't find the book with this isbn"})
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author=req.params.author;
  let foundBooks=[]
  for(let book in books) {
    if(books[book].author===author) {
       const booksbyauthor={
        "isbn":book,
        "title":books[book].title,
        "reviews":books[book].reviews
      }
      foundBooks.push(booksbyauthor)
    }
  }
  if (foundBooks.length > 0) {
    return res.status(200).json({"booksbyauthor": foundBooks});
  } else {
    return res.status(404).json({"booksbyauthor": "notfound"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title=req.params.title;
  let foundBooks=[]
  for(let book in books) {
    if(books[book].title===title) {
       const booksbyauthor={
        "isbn":book,
        "author":books[book].author,
        "reviews":books[book].reviews
      }
      foundBooks.push(booksbyauthor)
    }
  }
  if (foundBooks.length > 0) {
    return res.status(200).json({"booksbytitle": foundBooks});
  } else {
    return res.status(404).json({"booksbyauthor": "notfound"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
  if(isbn>10||isbn<1) return res.status(300).json({message: "we don't find the book with this isbn"})
  return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
