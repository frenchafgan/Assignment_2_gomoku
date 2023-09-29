const express = require('express');
const app = express();
const PORT = 3001;
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const authorize = require('./middleware/middleware');
const mongoose = require('mongoose');
const Game = require('./models/Game');

// Enable CORS for all routes
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // to support cookies
};

app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    process.env.REACT_APP_DB_URL ||
      'mongodb+srv://dbuser:Ilovecake123@gomoku.cjr0axx.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    // Mark this function as async
    console.log('Connected to MongoDB');

    // Use auth routes
    app.use('/auth', authRoutes);

    // Use game routes
    app.use('/game', gameRoutes); // Register gameRoutes

    // Example protected route
    app.get('/protected', authorize, (req, res) => {
      res.send('This is a protected route');
    });

    // Fetch all games
    app.get('/games', async (req, res) => {
      // Mark this function as async
      const games = await Game.find({}); // This should work now
      res.status(200).json(games);
    });

    // Global error-handling middleware (optional)
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

    // Start the server
    app.listen(3001, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB', err);
  });
