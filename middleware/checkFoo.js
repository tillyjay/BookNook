

const checkFoo = (req, res, next) => {
    
    //check for the existence of a header called x-foo
    //if it exists, respond with the contents of the header
    if(req.header('x-foo')) {
        res.send(req.header('x-foo'))
    } else {
    //if not, allow the request to continue 
        next()
    }


}

module.exports = checkFoo