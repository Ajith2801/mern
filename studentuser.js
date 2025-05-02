const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: String,
  regno: String,
  cgpa: Number,
  dept: String
});

const StudentModel = mongoose.model('students', StudentSchema, 'students');

module.exports = StudentModel
