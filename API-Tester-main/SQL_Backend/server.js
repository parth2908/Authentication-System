const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./src/config/db')
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
}));

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// User routes
app.use('/api/users', userRoutes);

// Start server after DB connection
const PORT = process.env.PORT || 51727;

sequelize.authenticate()
  .then(() => {
    console.log('SQL DB connected successfully');
    return sequelize.sync(); // Sync models with DB
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err.message);
  });
