const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

// Create a schema for your data
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String
});

// Create a model based on the schema
const Book = mongoose.model('Book', bookSchema);

// Create an Express app
const app = express();
app.use(express.json());

// Create a new book
app.post('/books', (req, res) => {
  const { title, author, genre } = req.body;

  const book = new Book({
    title,
    author,
    genre
  });

  book.save().then((result) => {
    res.json(result);
  }).catch((error) => {
    res.status(500).json({ error: 'Error creating book' });
  });
});

// Get all books
app.get('/books', (req, res) => {
  Book.find().then((books) => {
    res.json(books);
  }).catch((error) => {
    res.status(500).json({ error: 'Error retrieving books' });
  });
});

// Get a single book by ID
app.get('/books/:id', (req, res) => {
  const { id } = req.params;

  Book.findById(id).then((book) => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  }).catch((error) => {
    res.status(500).json({ error: 'Error retrieving book' });
  });
});

// Update a book by ID
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, genre } = req.body;

  Book.findByIdAndUpdate(id, {
    title,
    author,
    genre
  }, { new: true }).then((book) => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  }).catch((error) => {
    res.status(500).json({ error: 'Error updating book' });
  });
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;

  Book.findByIdAndRemove(id).then((book) => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  }).catch((error) => {
    res.status(500).json({ error: 'Error deleting book' });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
