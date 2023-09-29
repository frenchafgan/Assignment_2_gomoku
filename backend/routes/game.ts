const router = express.Router();

// Create a new game
gameRoutes.post('/create', authorize, async (req, res) => {
  // Added authorize middleware

  const {
    board,
    winner,
    date,
    username,
    moves,
    result,
    boardSize,
    currentPlayer,
    gameStatus,
    currentUser,
    gamesList,
  } = req.body;

  // Validate or sanitize input here if necessary

  const newGame = new Game({
    board,
    winner,
    date,
    username,
    moves,
    result,
    boardSize,
    currentPlayer,
    gameStatus,
    currentUser,
    gamesList,
  });

  try {
    await newGame.save();
    res.status(201).send('Game created');
  } catch (error) {
    console.error(`An error occurred while saving game: ${error}`);
    res.status(500).send('Internal Server Error');
  }
});

// Update a game
gameRoutes.put('/update/:gameId', authorize, async (req, res) => {
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

// Fetch a single game by ID
gameRoutes.get('/:gameId', authorize, async (req, res) => {
  const { gameId } = req.params;
  const game = await Game.findOne({ id: gameId });
  if (game) {
    res.status(200).json(game);
  } else {
    res.status(404).send('Game not found');
  }
});

// Fetch all games by username
gameRoutes.get('/user/:username', authorize, async (req, res) => {
  const { username } = req.params;
  const games = await Game.find({ username: username });
  if (games) {
    res.status(200).json(games);
  } else {
    res.status(404).send('No games found');
  }
});

module.exports = router;
