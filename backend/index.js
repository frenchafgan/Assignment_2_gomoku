const express = require('express');
const app = express();
const PORT = 3001;
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game'); // Import gameRoutes
const authorize = require('./middleware/middleware');
const mongoose = require('mongoose');
const cors = require('cors');

// Enable CORS for all routes
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // to support cookies
};

app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://dbuser:Ilovecake123@gomoku.cjr0axx.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to MongoDB');

    // Use auth routes
    app.use('/auth', authRoutes);

    // Use game routes
    app.use('/api/game', gameRoutes); // Register gameRoutes

    // Example protected route
    app.get('/protected', authorize, (req, res) => {
      res.send('This is a protected route');
    });

    // Specific error handling for routes
    app.use('/api/game', (err, req, res, next) => {
      console.error(`Error in /api/game route: ${err.stack}`);
      res.status(500).send('Something broke in game API!');
    });

    // Global error-handling middleware (optional)
    app.use((err, req, res, next) => {
      console.error(`Global error handler: ${err.stack}`);
      res.status(500).send('Something broke!');
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is on Atlas Cluster`);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB', err);
  });
