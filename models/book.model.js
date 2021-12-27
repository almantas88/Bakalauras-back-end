const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true},
  author: { type: String, required: true},
  description: { type: String },
  bookID: { type: String, required: true, unique: true }
});
module.exports = Book = mongoose.model("book", bookSchema);
