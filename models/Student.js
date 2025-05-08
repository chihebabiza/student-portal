const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // hashed
});

module.exports = mongoose.model('Student', studentSchema);
