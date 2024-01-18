var express = require('express');
var router = express.Router();


var usersRouter = require('./users');
var songsRouter = require('./songs');
var booksRouter = require('./books');

router.use('/users', usersRouter); //api/users
router.use('/songs', songsRouter); //api/songs
router.use('/books', booksRouter); //api/books


router.get('/', (req, res) => { //api
  res.send('Welcome to te API')
});



module.exports = router