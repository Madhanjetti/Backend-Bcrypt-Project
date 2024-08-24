const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// In-memory storage for users (no database used)
let users = [];

// Routes

// Home route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register</title>
  <style>

  body {
    display:flex;
    flex-direction: column;
  justify-content: center; 
  align-items: center; 
  background-color: #f2f2f2;
 
  
}
 
  </style>
</head>
<body>
    <h1>Welcome to Simple Bcrypt Project</h1>
    <a href="/register">Register</a>
    <br/>
    <a href="/login">Login</a>
</body>
    `);
  
});

// Show registration form
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle user registration
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, age } = req.body;

    // Check if user already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(400).send('Username already exists!');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the new user to the in-memory array
    users.push({
      username,
      password: hashedPassword,
      email,
      age
    });

    res.redirect('/login');
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

// Show login form
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle user login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }

    // Successful login, redirect to profile page
    res.redirect(`/profile?username=${username}`);
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

// Show user profile
app.get('/profile', (req, res) => {
  const { username } = req.query;

  // Find the user by username
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).send('User not found');
  }

  res.render('profile', { user });
});

// Start the server
const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
