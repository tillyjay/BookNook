const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    max: [100, 'First name should not exceed 100 characters.'],
    required: [true, 'First name is required.'],
  },
  lastName: {
    type: String,
    max: [100, 'Last name should not exceed 100 characters.'],
    required: [true, 'Last name is required.'],
  },
  email: {
    type: String,
    unique: [true, 'Email already exists.'],
    validate: {
        validator: (value) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value),
        message: 'Email format is invalid.',
    },
    required: [true, 'Email is required.'],
  },
  password: {
    type: String,
    max: [255, 'Password should not exceed 255 characters.'],
    required: [true, 'Password is required.'],
  }
}, { collection: 'users' });


module.exports = mongoose.model('User', userSchema);
