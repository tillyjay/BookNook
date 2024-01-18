var express = require('express');
var router = express.Router();
var Book = require('../../models/book');
const utils = require('../../functions/utils');
const mongoose = require('mongoose');
const CastError = mongoose.Error.CastError; 
const validateJWT = require('../../middleware/validateJWT');
const book = require('../../models/book');

//get all book documents (GET)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({});

    //format each book using the utils.formatBook function
    const formattedBooks = books.map(book => utils.formatBook(book));
        
    //200 "OK" successfully retrieved data in response body
    res.status(200).json(formattedBooks);
  } catch (error) { 
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//get maximum ranking (total document number)
router.get('/max-ranking', async (req, res) => {
  try {
    const maxRanking = await Book.findOne({}, { ranking: 1 }, { sort: { ranking: -1 } });
    res.json({ maxRanking: maxRanking ? maxRanking.ranking : 0 });
  } catch (error) {
    console.error("Error fetching max ranking: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//get singular book document by id (GET)
router.get('/:id', async (req, res) => {
  try {
       console.log(req.params);
    const book = await Book.findById(req.params.id);
   
    if (book) {
        //format the book using the utils.formatBook function
        const formattedBook = utils.formatBook(book);

        //200 "OK" successfully retrieved data by id in response body
        res.status(200).json(formattedBook);
    } 

  } catch (error) {
    if (error instanceof CastError) {
        return res.status(400).json({ error: 'Document not found, invalid book ID provided.' });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


//form will not submit until valid JWT is present 
//create a new book document (POST)
router.post('/', validateJWT, async (req, res) => {
  try {
    const newBookData = req.body;
    console.log(newBookData);


    //check if book with same title already exists
    const existingBookTitle = await Book.findOne({
      title: newBookData.title,
    });

  
    //if there is a book with same title and it is not book being updated
    if (existingBookTitle){
      return res
        .status(409)
        .json({ serverMessage: "Book title already in use." });
    }
 

    //format the new book data using the utils.formatBook function
    // const formattedNewBook = utils.formatBook(newBookData);

    //if no validation errors create a new book document
    const newBook = await Book.create(newBookData);

    //201 "Created" successful creation of new resource (book document)
    res.status(201).json(newBook);
  } catch (error) {

    if (error.name === 'ValidationError') {
        //initialize validation error object to display custom error message
        const errors = {};
  
        //loop through each field that failed validation and extract error message
        //store in above errors object, maping field names(keys) to corresponding error messages(values)
        for (const field in error.errors) {
          errors[field] = error.errors[field].message;
        }
          //400 "Bad Request" The server cannot or will not process the request 
            return res.status(400).json({ errors });

    } else {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


//update existing book document by id (PUT)
router.put('/:id', validateJWT, async (req, res) => {
  try {
    const updatedBookData = req.body;

    //get book id 
    const bookId = req.params.id;

    //check if book with same title already exists
    const existingBookTitle = await Book.findOne({ title: updatedBookData.title });

    //if there is a book with same title and it is not book being updated
    if (existingBookTitle && existingBookTitle._id != bookId) {
      return res.status(409)
        .json({ serverMessage: "Book title already in use." });
    }

    //format the updated book data using the utils.formatBook function
    const formattedUpdatedBook = utils.formatBook(updatedBookData);

    //find the existing book document by id
    const existingBook = await Book.findById(req.params.id);

    if (existingBook) {
      //update the existing book document with formatted data
      existingBook.set(formattedUpdatedBook);
      const updatedBook = await existingBook.save();

      //200 "OK" successful update
      res.status(200).json(updatedBook);
    }
  } catch (error) {

    if (error instanceof CastError) {
        return res.status(400).json({ serverMessage: 'Document not found, invalid book ID provided.' });
      
    } else if (error.name === 'ValidationError') {
        //initialize validation error object to display custom error message
        const errors = {};
  
        //loop through each field that failed validation and extract error message
        //store in above errors object, maping field names(keys) to corresponding error messages(values)
        for (const field in error.errors) {
          errors[field] = error.errors[field].message;
        }
          //400 "Bad Request" The server cannot or will not process the request 
          return res.status(400).json({ errors });
  
    } else {
        res.status(500).json({ error: 'Internal Server Error' });   
    }
  }
});

  
//delete existing book document by id (DELETE)
router.delete('/:id', validateJWT, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndRemove(req.params.id);
    if (deletedBook) {
        //204 "No Content" successful deletion
        res.status(204).send();
    } 
  } catch (error) {
    if (error instanceof CastError) {
        return res.status(400).json({ serverMessage: 'Document not found, invalid book ID provided.' });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});



//export module for app.js
module.exports = router;

