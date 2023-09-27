const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const authorize = require('../middleware/middleware'); // Import the authorization middleware

// Create a new game
router.post('/create', authorize, async (req, res) => {
  console.log('Received request body:', req.body);
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
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

// Update an existing game
router.put('/update/:gameId', authorize, async (req, res) => {
  const { gameId } = req.params;
  const { boardSize, date, moves, result, username } = req.body;

  try {
    const updatedGame = await Game.findOneAndUpdate(
      { id: gameId },
      { boardSize, date, moves, result, username },
      { new: true }
    );

    if (updatedGame) {
      res.status(200).send('Game updated');
    } else {
      res.status(404).send('Game not found');
    }
  } catch (error) {
    console.error('Error while updating the game:', error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});

// Save a completed game (consider adding a comment explaining how this differs from /create)
router.post('/saveGame', authorize, async (req, res) => {
  const { winner, moves } = req.body;

  const newGame = new Game({
    id,
    boardSize,
    date,
    moves,
    result,
    username,
  });

  try {
    const savedGame = await newGame.save();
    res.json(savedGame);
  } catch (err) {
    console.error('Error while saving the completed game:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
