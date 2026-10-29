// Task 2 - Inline styles, basic interaction and server-side validation
const express = require('express');
const path = require('path');
const { validateRegistration, COURSES, SKILLS } = require('./validators');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Temporary server-side storage (lost when the server restarts)
const registrations = [];

const formOptions = { COURSES, SKILLS };

app.get('/', (req, res) => {
  res.render('index', { title: 'Register', errors: {}, values: {}, ...formOptions });
});

app.post('/register', (req, res) => {
  const { valid, errors, clean } = validateRegistration(req.body);

  if (!valid) {
    // Send the form back with messages and the values the user already typed
    return res.status(400).render('index', {
      title: 'Register', errors, values: { ...req.body, skills: clean.skills }, ...formOptions
    });
  }

  // Block duplicate emails
  if (registrations.some(r => r.email === clean.email)) {
    return res.status(409).render('index', {
      title: 'Register',
      errors: { email: 'This email is already registered.' },
      values: { ...req.body, skills: clean.skills }, ...formOptions
    });
  }

  const record = { id: registrations.length + 1, ...clean, createdAt: new Date().toLocaleString() };
  delete record.terms;
  registrations.push(record);
  res.redirect('/success/' + record.id);   // Post/Redirect/Get avoids duplicate submits on refresh
});

app.get('/success/:id', (req, res) => {
  const record = registrations.find(r => r.id === Number(req.params.id));
  if (!record) return res.redirect('/');
  res.render('success', { title: 'Registered', record });
});

app.get('/registrations', (req, res) => {
  res.render('registrations', { title: 'Registrations', registrations });
});

app.listen(PORT, () => console.log(`Task 2 running at http://localhost:${PORT}`));
