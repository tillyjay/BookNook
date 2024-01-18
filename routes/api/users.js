const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const cookie = require("cookie");


/* GET users listing. */
router.get('/', async (req, res) => {
  try {
      const users = await User.find({});

      //200 "OK" successfully retrieved data in response body
      res.status(200).json(users);
  } catch (error) { 
      console.error("Error retrieving:", error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//endpoint for register: name, email, password
// endpoint for register: name, email, password
router.post('/register', async (req, res) => {
  try {
    // extract variables from request body
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    // check if user already exists by email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ serverMessage: 'User email already in use.' });
    }

    // if user email is unique, hash password
    const hashPass = await bcrypt.hash(password, 13);
    console.log(hashPass);

    // create a new user with hashed password using new to allow for future logic
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPass,
    });

    // save new user to db
    await newUser.save();

    try {
      // if user exists and password matches, generate a JSON web token
      // jwt expires does not expire
      const jwtToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

      // token created successfully
      console.log('JWT Token created successfully');

      // define cookie options, including secure and httpOnly properties
      const cookieOptions = {
        // cookie should only be sent over HTTPS
        secure: true,
        // cookie is not accessible via JavaScript on the client side
        httpOnly: true,
        path: '/',
      };

      // serialize cookie with name "jwt," value of jwtToken, and specified options
      const cookieString = cookie.serialize('jwt', jwtToken, cookieOptions);

      // set "Set-Cookie" header in the response with serialized cookie string
      res.setHeader('Set-Cookie', cookieString);

      // 201 "Created" successful creation of new resource (user)
      // respond with email and newly generated user id
      return res.status(201).json({
        message: `Registration success: Email: ${newUser.email}, User Id: ${newUser._id}`,
      });
    } catch (error) {
      return res.status(400).json({ error: 'Error signing JWT token:', message: error.message });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      // initialize validation error object to display a custom error message
      const errors = {};

      // loop through each field that failed validation and extract error message
      // store in above errors object, mapping field names(keys) to corresponding error messages(values)
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }

      // 400 "Bad Request" The server cannot or will not process the request
      return res.status(400).json({ errors });
    } else {
      console.error('Error during registration:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


//endpoint for signin: email, password
router.post("/signin", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ serverMessage: "Invalid login" });
    }

    const hashMatch = await bcrypt.compare(password, user.password);

    if (!hashMatch) {
      return res.status(401).json({ serverMessage: "Invalid login" });
    }

    try {
      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      const cookieOptions = {
        secure: true,
        httpOnly: true,
        path: "/",
      };

      const cookieString = cookie.serialize("jwt", jwtToken, cookieOptions);

      res.setHeader("Set-Cookie", cookieString);

      return res.status(200).json({ message: "Sign in success" });
    } catch (error) {
      console.error("Error signing JWT token:", error);
      return res
        .status(400)
        .json({ error: "Error signing JWT token", message: error.message });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


//endpoint for sign out (logout)
router.get('/signout', (req, res) => {
  res.clearCookie('jwt');
  res.status(204).send();
}) 



module.exports = router;
