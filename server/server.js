const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Si nécessaire pour les cookies/authentification
}));
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://emmaengongomo5:Ao7NA95O8CGvH0es@expressapi.cwjdg.mongodb.net/?retryWrites=true&w=majority&appName=ExpressApi';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Connection Error:', err));

// Define a schema and model
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  price: { type: Number },
  rating: { type: Number },
  warranty_years: { type: Number },
  available: { type: Boolean },
});
const Item = mongoose.model('Collection', ItemSchema);

// Routes

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new item
app.post('/api/items', async (req, res) => {
  const { name, type, price, rating, warranty_years, available } = req.body;

  const newItem = new Item({
    name,
    type,
    price,
    rating,
    warranty_years,
    available,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an item by ID
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an item by ID
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
