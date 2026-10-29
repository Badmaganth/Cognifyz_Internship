// Task 5 - RESTful API (CRUD) + front end that talks to it with fetch()
// Resource: /api/tasks   (a small to-do list)
// Data lives in memory; Task 6 replaces this with a real database.

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());                                   // parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public')));   // serve the front end

/* ---------------- data ---------------- */
let nextId = 4;
let tasks = [
  { id: 1, title: 'Read the REST API notes', description: 'Methods, status codes, resources.', priority: 'high', done: true,  createdAt: new Date().toISOString() },
  { id: 2, title: 'Build the CRUD endpoints', description: 'GET, POST, PUT, PATCH and DELETE.',  priority: 'high', done: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Connect the front end',    description: 'Use fetch() to call the API.',       priority: 'medium', done: false, createdAt: new Date().toISOString() }
];

const PRIORITIES = ['low', 'medium', 'high'];

/* ---------------- validation ---------------- */
function validateTask(body, { partial = false } = {}) {
  const errors = [];
  const out = {};

  if (!partial || body.title !== undefined) {
    const title = String(body.title || '').trim();
    if (title.length < 3 || title.length > 80) errors.push('title must be 3 to 80 characters');
    out.title = title;
  }
  if (!partial || body.description !== undefined) {
    const description = String(body.description || '').trim();
    if (description.length > 200) errors.push('description can be at most 200 characters');
    out.description = description;
  }
  if (!partial || body.priority !== undefined) {
    const priority = body.priority === undefined ? 'medium' : body.priority;
    if (!PRIORITIES.includes(priority)) errors.push('priority must be low, medium or high');
    out.priority = priority;
  }
  if (body.done !== undefined) {
    if (typeof body.done !== 'boolean') errors.push('done must be true or false');
    out.done = body.done;
  }
  return { errors, data: out };
}

function findTask(req, res) {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    res.status(404).json({ error: `Task ${req.params.id} not found` });
    return null;
  }
  return task;
}

/* ---------------- routes ---------------- */

// READ all  (optional filters: ?status=done|open  ?priority=high  ?q=text)
app.get('/api/tasks', (req, res) => {
  let result = tasks;
  const { status, priority, q } = req.query;
  if (status === 'done') result = result.filter(t => t.done);
  if (status === 'open') result = result.filter(t => !t.done);
  if (priority) result = result.filter(t => t.priority === priority);
  if (q) {
    const needle = String(q).toLowerCase();
    result = result.filter(t => (t.title + ' ' + t.description).toLowerCase().includes(needle));
  }
  res.json(result);
});

// READ one
app.get('/api/tasks/:id', (req, res) => {
  const task = findTask(req, res);
  if (task) res.json(task);
});

// CREATE
app.post('/api/tasks', (req, res) => {
  const { errors, data } = validateTask(req.body || {});
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });

  const task = { id: nextId++, done: false, createdAt: new Date().toISOString(), ...data };
  tasks.push(task);
  res.status(201).location(`/api/tasks/${task.id}`).json(task);
});

// UPDATE (replace the editable fields)
app.put('/api/tasks/:id', (req, res) => {
  const task = findTask(req, res);
  if (!task) return;
  const { errors, data } = validateTask(req.body || {});
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  Object.assign(task, data);
  res.json(task);
});

// UPDATE (change only the fields that were sent, e.g. { "done": true })
app.patch('/api/tasks/:id', (req, res) => {
  const task = findTask(req, res);
  if (!task) return;
  const { errors, data } = validateTask(req.body || {}, { partial: true });
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  Object.assign(task, data);
  res.json(task);
});

// DELETE
app.delete('/api/tasks/:id', (req, res) => {
  const task = findTask(req, res);
  if (!task) return;
  tasks = tasks.filter(t => t.id !== task.id);
  res.status(204).end();
});

/* ---------------- errors ---------------- */
app.use('/api', (req, res) => res.status(404).json({ error: 'Unknown API route' }));

// Bad JSON in a request body ends up here
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Request body is not valid JSON' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => console.log(`Task 5 running at http://localhost:${PORT}`));
