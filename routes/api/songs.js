var express = require('express');
var router = express.Router();
var Song = require('../../models/song');
var demoMiddleware = require('../../middleware/demoMiddleware');
var checkFoo = require('../../middleware/checkFoo');


router.use(checkFoo);

/* GET songs listing. */
router.get('/', (req, res) => {
    // find creates the query
    Song.find().exec() // exec returns a promise
                    .then(songs => {
                        res.send(songs)
                    })
                    .catch(err => {
                        res.statusCode(500).send({
                            message: "Server Error, come back soon."
                        })
                    });

});


// GET one song
router.get('/:id', demoMiddleware, (req, res) => {
    Song.findId(req.params.id)
    .exec()
    .then(song => {
        res.send(song)
    })
    .catch(err => {
        res.statusCode(500).send({
            message: "Server Error, come back soon."
        })
    })
    // res.send(`GET ONE SONG WITH ID ${req.params.id}`)
})


// POST 
router.post('/', (req, res) => {
    
    const newSong = new Song(req.body);
    
    newSong.save()
        .then(result => res.status(201).send(result))
        .catch(err => { 
            if(err.name === "Validation Error") {
                res.status(422).send(err)
            } else {
                res.status(500).send({
                    message: "Server Error, come back soon."
                })
            }
        })
})

// PUT 
router.put('/:id', (req, res) => {
    res.send(`Update song with ID ${req.params.id}`)
    
    
})

// DELETE
router.delete('/:id', (req, res) => {
    res.send(`Delete song with ID ${req.params.id}`)
})

module.exports = router;