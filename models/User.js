const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  collectionIds: [mongoose.Types.ObjectId],
  reviewIds: [mongoose.Types.ObjectId],
});

module.exports = mongoose.model('User', userSchema);