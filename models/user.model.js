const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
email: { type: String, required: true, unique: true },
password: { type: String, required: true, minlength: 5 },
firstName: { type: String, required: true },
lastName: { type: String, required: true},
cardID:  { type: String, required: true, unique: true},
role: { type: String, default: "STUDENT"},
grade: { type: String, required: true}
});
module.exports = User = mongoose.model("user", userSchema);