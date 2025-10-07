const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = require('./src/config/db');

// Test database connection
db.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GalHub Game Platform API' });
});

// API routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/games', require('./src/routes/game.routes'));
app.use('/api/users', require('./src/routes/user.routes'));

// Set port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});