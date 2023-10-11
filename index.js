// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  collectionIds: [mongoose.Types.ObjectId],
  reviewIds: [mongoose.Types.ObjectId],
});

module.exports = mongoose.model('User', userSchema);

// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  // Add more movie-related fields as needed
});

module.exports = mongoose.model('Movie', movieSchema);

// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  content: String,
  movieId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
});

module.exports = mongoose.model('Review', reviewSchema);

// models/Collection.js
const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  movieIds: [mongoose.Types.ObjectId],
  userId: mongoose.Types.ObjectId,
});

module.exports = mongoose.model('Collection', collectionSchema);
