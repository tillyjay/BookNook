const jwt = require('jsonwebtoken');

//verify token middleware
//apply it to POST, PUT, DELETE CRUD endpoints in books.js

const validateJWT = (req, res, next) => {

  //extract cookies value of JWT
  const authToken = req.cookies.jwt;
  console.log(authToken);

  try {
    
    if(authToken) {
      //verify jwt exists and is valid
      const decode = jwt.verify(authToken, process.env.JWT_SECRET);
      console.log(decode);
      //continue on to the next middleware or route 
      next();

    } else {
      //401 "Bad Request" if jwt does not exist or is not valid, access is denied
      res.status(401).json({error: 'Token is not valid: Access is Denied.'});
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = validateJWT;