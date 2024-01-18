 
//formating books to ensure correct order of elements displayed
//for some reason they were displaying mixed up
const formatBook = (book) => ({
    "_id": book._id,
    "ranking": book.ranking,
    "title": book.title,
    "cover_image_url": book.cover_image_url,
    "blurb": book.blurb,
    "author": {
        "first_name": book.author.first_name,
        "last_name": book.author.last_name,
        "birth_year": book.author.birth_year,
        "nationality": book.author.nationality,
        "image_url": book.author.image_url,
        "profile": book.author.profile
    },
    "publication": {
        "year": book.publication.year,
        "publisher": book.publication.publisher
    },
    "genres": book.genres,
    "number_of_pages": book.number_of_pages,
    "rating": book.rating,
    "number_of_ratings": book.number_of_ratings,
    "literary_awards": book.literary_awards
});

module.exports = { formatBook };