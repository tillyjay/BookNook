
const demoMiddleware = (req, res, next) => {
    
    res.send('You reached the demo middleware!');

    

}


module.exports = demoMiddleware;