// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  // Add more movie-related fields as needed
});

module.exports = mongoose.model('Movie', movieSchema);