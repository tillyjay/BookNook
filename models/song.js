const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true 
    },
    artist: String, 
    releaseYear: Number,
    genres: [String],
    ratings: [Number]
}, {collection: 'songs'})


module.exports = mongoose.model('Song', songSchema);
