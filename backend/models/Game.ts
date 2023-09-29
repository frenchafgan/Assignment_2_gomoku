const moveSchema = new mongoose.Schema({
  color: { type: String, required: true },
  order: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const boardCellSchema = new mongoose.Schema({
  type: { type: Number, required: true },
});

const boardRowSchema = new mongoose.Schema({
  cells: { type: [boardCellSchema], required: true },
});

const gameSchema = new mongoose.Schema({
  board: { type: [boardRowSchema], required: true },
  winner: { type: String, required: true },
  date: { type: Date, required: true },
  username: { type: String },
  moves: { type: [moveSchema], required: true },
  result: { type: String, required: true },
  boardSize: { type: Number },
  currentPlayer: { type: Number, required: true },
  gameStatus: { type: String, required: true },
  currentUser: { type: String },
  gamesList: { type: [String], default: [] },
});

module.exports = mongoose.model('Game', gameSchema);
