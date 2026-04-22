const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Reading = require('./models/Reading');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  console.log('Body:', req.body);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// POST - receive sensor data from Arduino
app.post('/api/reading', async (req, res) => {
  try {
    console.log('Data received:', req.body);
    const { ph, temperature, conductivity } = req.body;

    // Simple fraud detection logic
    let result = 'Pure';
    if (ph < 6.0 || ph > 7.0) result = 'Adulterated';
    if (conductivity > 800) result = 'Detergent';
    if (temperature > 40) result = 'Urea';

    const reading = new Reading({ ph, temperature, conductivity, result });
    await reading.save();

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - fetch all readings
app.get('/api/readings', async (req, res) => {
  try {
    const readings = await Reading.find().sort({ timestamp: -1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});