const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const authorize = require('../middleware/middleware'); // Import the authorization middleware

router.post('/create', authorize, async (req, res) => {
  console.log('Received request body:', req.body); // Log the request body
  const { id, boardSize, date, moves, result, username } = req.body;

  if (!id || !boardSize || !date || !result || !username) {
    return res.status(400).send('Missing required fields');
  }

  const newGame = new Game({ id, boardSize, date, moves, result, username });
  try {
    await newGame.save();
    res.status(201).send('Game created');
  } catch (error) {
    console.error('Error while saving the game:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a game
router.put('/update/:gameId', authorize, async (req, res) => {
  // Added authorize middleware
  const { gameId } = req.params;
  const { boardSize, date, moves, result, username } = req.body;

  // Find and update the game in MongoDB
  const updatedGame = await Game.findOneAndUpdate(
    { id: gameId }, // Search by game ID
    { boardSize, date, moves, result, username }, // Fields to update
    { new: true } // Return the updated document
  );

  if (updatedGame) {
    res.status(200).send('Game updated');
  } else {
    res.status(404).send('Game not found');
  }
});

module.exports = router;
