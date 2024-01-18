const jwt = require('jsonwebtoken')




const token = jwt.sign({email: 'mike@mike.com'}, 'mylittlesecret');

console.log(token) 

