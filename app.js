//import our required modules 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var dotenv = require('dotenv');
var cors = require('cors');

//load in any env variables from .env file
dotenv.config()

//establish a connection to mongodb
mongoose.connect(process.env.MONGO_DB);

//define our router - mini express app in an app
//how would we like express to handle it 
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api'); //look for api.js -> folder api

//define the app - core of application
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//defining middleware
// if(process.env.NODE_ENV != 'production' ) {
  const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  };
  app.use(cors(corsOptions)); //allow requests from any origin 
// }
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/dist')));

//use routers
app.use('/', indexRouter);
app.use('/api', apiRouter);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// //dedicated port 3000
// const port = 5000;

// //start up the app and listen on specified port
// app.listen(port, () => {
//   console.log(`People app listening on port ${port}`)
// })

module.exports = app;
