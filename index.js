const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));


//MongoDB URI
const mongoURI = 'mongo_url_here';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Schema and Model
const quoteSchema = new mongoose.Schema({
  text: String,
  author: String
});

const Quote = mongoose.model('Quote', quoteSchema);

// POST: Add a new quote
app.post('/quotes', async (req, res) => {
  const { text, author } = req.body;
  if (!text || !author) {
    return res.status(400).json({ error: 'Both text and author are required' });
  }
  try {
    const newQuote = new Quote({ text, author });
    await newQuote.save();
    res.status(201).json(newQuote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save quote' });
  }
});

// GET: Get all quotes
app.get('/quotes', async (req, res) => {
  try {
    const allQuotes = await Quote.find();
    res.json(allQuotes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

app.get('/quotes/random', async (req, res) => {
    try {
      const count = await Quote.countDocuments();
      const random = Math.floor(Math.random() * count);
      const randomQuote = await Quote.findOne().skip(random);
      res.json(randomQuote);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch random quote' });
    }
  });
  
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


