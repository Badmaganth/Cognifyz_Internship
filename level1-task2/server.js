const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

const registrations = [];

app.get('/', (req, res) => {
    res.render('index', { message: '', formData: {} });
});

app.post('/register', (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
        return res.status(400).render('index', {
            message: 'Please fill in all fields.',
            formData: req.body
        });
    }

    if (!email.includes('@') || Number(age) < 1) {
        return res.status(400).render('index', {
            message: 'Enter a valid email and age.',
            formData: req.body
        });
    }

    registrations.push({ name, email, age });
    res.render('index', {
        message: 'Registration successful!',
        formData: {}
    });
});

app.listen(PORT, () => {
    console.log(`Task 2 server running at http://localhost:${PORT}`);
});
