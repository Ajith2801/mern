// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const StudentModel = require('./user');  // <-- import your model

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/student')
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

// Save a student
app.post('/saveStudent', async (req, res) => {
  const { name, regno, cgpa, dept } = req.body;
  try {
    const newStudent = new StudentModel({ name, regno, cgpa, dept });
    await newStudent.save();
    res.status(201).json({ message: 'Student saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving student', error: error.message });
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Search student by ID
app.get('/student/:id', async (req, res) => {    // Changed from regno to id
  try {
    const student = await StudentModel.findById(req.params.id); // Search by ID
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

// Delete a student
app.delete('/deleteStudent/:id', async (req, res) => {
  try {
    await StudentModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

// Update a student
app.put('/updateStudent/:id', async (req, res) => {
  const { name, regno, cgpa, dept } = req.body;
  try {
    await StudentModel.findByIdAndUpdate(req.params.id, { name, regno, cgpa, dept }, { new: true });
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
