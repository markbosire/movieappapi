const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  content: String,
  movieId: Number,
  userId: mongoose.Types.ObjectId,
  score: Number,
  date: {
    type: Date,
    default: Date.now, // Set the default value to the current date and time
  },
});

module.exports = mongoose.model('Review', reviewSchema);