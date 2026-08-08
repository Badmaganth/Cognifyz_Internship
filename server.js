const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let items = [
  { id: 1, name: 'Item One' },
  { id: 2, name: 'Item Two' }
];

// GET - Read
app.get('/api/items', (req, res) => {
  res.json(items);
});

// POST - Create
app.post('/api/items', (req, res) => {
  const newItem = { id: Date.now(), name: req.body.name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// DELETE - Delete
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  items = items.filter(item => item.id !== id);
  res.json({ message: 'Item deleted successfully' });
});

app.listen(PORT, () => console.log(`Task 5 API running on http://localhost:${PORT}`));