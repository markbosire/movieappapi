// models/Collection.js
const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: String, // Add a field for the collection name
  movieIds: [Number],
  userId: mongoose.Types.ObjectId,
});

module.exports = mongoose.model('Collection', collectionSchema);
