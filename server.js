const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/aadharDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Error:', err));

// 2. Create a Mongoose Schema and Model
const AadharSchema = new mongoose.Schema({
  name: String,
  aadharNumber: String,
  address: String
});

const Aadhar = mongoose.model('Aadhar', AadharSchema);

// 3. CRUD APIs

// Create - POST /aadhars
app.post('/aadhars', async (req, res) => {
  try {
    const aadhar = new Aadhar(req.body);
    await aadhar.save();
    res.status(201).json(aadhar);
  } catch (error) {
    res.status(500).json({ error: 'Error creating aadhar detail' });
  }
});

// Read - GET /aadhars
app.get('/aadhars', async (req, res) => {
  try {
    const allAadhars = await Aadhar.find();
    res.json(allAadhars);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching aadhar details' });
  }
});

// Update - PUT /aadhars/:id
app.put('/aadhars/:id', async (req, res) => {
  try {
    const updatedAadhar = await Aadhar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAadhar);
  } catch (error) {
    res.status(500).json({ error: 'Error updating aadhar detail' });
  }
});

// Delete - DELETE /aadhars/:id
app.delete('/aadhars/:id', async (req, res) => {
  try {
    await Aadhar.findByIdAndDelete(req.params.id);
    res.json({ message: 'Aadhar detail deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting aadhar detail' });
  }
});

// 4. Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
