import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../../src/api'; // Make sure this import is correct
import { checkWin, isDraw } from '../../utils/gameUtils';
import { RootState } from '../store';
// import { login } from './../../api';
// import { username } from './../user/userSlice';

interface Move {
  x: number;
  y: number;
  color: string;
  order: number;
}

interface GameState {
  board: number[][];
  currentPlayer: number;
  gameStatus: 'playing' | 'draw' | 'win';
  boardSize: number;
  currentUser: string | null;
  moves: Move[];
  gamesList: any[];
  username: string | null;
}

const initialBoard = Array.from({ length: 20 }, () => Array(20).fill(0));
const savedBoardSize = localStorage.getItem('boardSize');
const initialBoardSize = savedBoardSize ? JSON.parse(savedBoardSize) : 10;
const moves: Move[] = [];

const initialState: GameState = {
  board: initialBoard,
  currentPlayer: 1,
  gameStatus: 'playing',
  boardSize: initialBoardSize,
  currentUser: null,
  moves: moves,
  gamesList: [],
  username: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    makeMove(state, action: PayloadAction<{ x: number; y: number }>) {
      const { x, y } = action.payload;
      if (state.board[y][x] === 0) {
        state.board[y][x] = state.currentPlayer;

        // Record the move
        const moveColor = state.currentPlayer === 1 ? 'black' : 'white';
        state.moves.push({
          x,
          y,
          color: moveColor,
          order: state.moves.length + 1,
        });

        if (checkWin(state.board, x, y, state.currentPlayer)) {
          state.gameStatus = 'win';
        } else if (isDraw(state.board)) {
          state.gameStatus = 'draw';
        } else {
          state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        }
      }
    },

    setBoardSize(state, action: PayloadAction<number>) {
      const size = action.payload;
      state.board = Array.from({ length: size }, () => Array(size).fill(0));
    },

    restartGame: (state, action: PayloadAction<number>) => {
      // You can now use action.payload as the board size
      const savedBoardSize = localStorage.getItem('boardSize');
      const boardSize = savedBoardSize
        ? JSON.parse(savedBoardSize)
        : action.payload;

      // Reset the board while keeping the size
      state.board = Array.from({ length: boardSize }, () =>
        Array(boardSize).fill(0)
      );

      // Reset the player and game status
      state.currentPlayer = 1;
      state.gameStatus = 'playing';
      state.moves = [];
    },

    updateGamesList: (state, action: PayloadAction<any[]>) => {
      state.gamesList = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createGame.fulfilled, (state, action) => {
        // Assuming action.payload contains the newly created game's data
        // Update your state variables here. For example:
        state.board = action.payload.board;
        state.currentPlayer = action.payload.currentPlayer;
        state.gameStatus = action.payload.gameStatus;
        state.boardSize = action.payload.boardSize;
        state.currentUser = action.payload.currentUser;
        state.moves = action.payload.moves;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        // Assuming action.payload contains the updated game's data
        // Update your state variables here. For example:
        state.board = action.payload.board;
        state.currentPlayer = action.payload.currentPlayer;
        state.gameStatus = action.payload.gameStatus;
        state.boardSize = action.payload.boardSize;
        state.currentUser = action.payload.currentUser;
        state.moves = action.payload.moves;
      });
  },
});

export const { makeMove, restartGame, setBoardSize, updateGamesList } =
  gameSlice.actions;

export default gameSlice.reducer;

export const createGame = createAsyncThunk(
  'game/createGame',
  async (gameData: GameState, thunkAPI) => {
    // Replace YourGameDataType with the actual type

    const response = await api.createGame(gameData); // Use your specific createGame function

    return response.data;
  }
);

export const updateGame = createAsyncThunk(
  'game/updateGame',
  async ({ gameId, gameData }: any) => {
    const response = await api.updateGame(gameId, gameData);
    return response.data;
  }
);

export const getGamesList = createAsyncThunk(
  'game/getGamesList',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const token = state.auth.token;
    const username = state.user.username;
    if (!token) {
      return thunkAPI.rejectWithValue('No token found');
    }

    if (!username) {
      return thunkAPI.rejectWithValue('No username found');
    }

    try {
      const response = await api.getGamesList(token);
      return response.data;
    } catch (error: unknown) {
      // Specify that error is of type unknown
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        // Type guard
        errorMessage = error.message;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
