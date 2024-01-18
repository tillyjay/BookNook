const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    ranking: {
      type: Number,
      min: [1, "Ranking should be at least 1."],
      max: [100, "Ranking should not exceed 100."],
      unique: [true, "Ranking must be unique."],
      required: [true, "Ranking is required."],
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    cover_image_url: {
      type: String,
      required: [true, "Cover image of book is required"],
    },
    blurb: {
      type: String,
      default: "",
      maxlength: [255, "Summary should not exceed 285 characters."],
      required: [true, "Summary of book is required."],
    },
    author: {
      first_name: {
        type: String,
        required: [true, "Author's first name is required."],
      },
      last_name: {
        type: String,
        required: [true, "Author's last name is required."],
      },
      birth_year: {
        type: Number,
        required: false
      },
      nationality: {
        type: String,
        required: false,
      },
      image_url: {
        type: String,
        required: [true, "Image of author is required"],
      },
      profile: {
        type: String,
        default: "",
        maxlength: [450, "Profile should not exceed 450 characters."],
        required: [true, "Author profile is required."],
      },
    },
    publication: {
      year: {
        type: Number,
        min: [1800, "Publication year should be at least 1800."],
        max: [2024, "Publication year should not exceed 2024."],
        required: false,
      },
      publisher: {
        type: String,
        required: false
      },
    },
    genres: {
      type: [String],
      required: false
    },
    number_of_pages: {
      type: Number,
      min: [5, "Number of pages should be at least 5."],
      required: false
    },
    rating: {
      type: Number,
      min: [1, "Rating should be at least 1."],
      max: [5, "Rating should not exceed 5."],
      required: [true, "Rating is required."],
    },
    number_of_ratings: {
      type: Number,
      required: [true, "Number of ratings is required."],
    },
    literary_awards: {
      type: [String],
      required: false,
    },
  },
  
  { collection: "books" }
);

module.exports = mongoose.model('Book', bookSchema);

