import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { createGame, updateGame, makeMove, restartGame, updateGamesList } from '../redux/game/gameSlice';
import '../styles/Game.css';
import { saveGameDetails } from '../utils/gameUtils';
import Header from '../components/Header';
import { AppDispatch } from '../redux/store';
import { getGamesList as getGameByIdAndUserApi } from '../api';  // Update the path according to your project structure
import { useToken } from '../redux/useToken';
import { setupAxios } from '../api';
import { useNavigate } from 'react-router-dom';

const Game: React.FC = () => {
  const board = useSelector((state: RootState) => state.game.board);
  const currentPlayer = useSelector((state: RootState) => state.game.currentPlayer);
  const gameStatus = useSelector((state: RootState) => state.game.gameStatus);
  const username = useSelector((state: RootState) => state.auth.currentUser) || '';
  const moves = useSelector((state: RootState) => state.game.moves);
  const currentBoardSize = useSelector((state: RootState) => state.game.boardSize);
  const dispatch = useDispatch<AppDispatch>();
  const [gameId, setGameId] = useState<number>();
  const token = useToken();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  



  useEffect(() => {
    setupAxios(token);
  }, [token]);

  const handleCellClick = (x: number, y: number) => {
    if (board[y][x] === 0 && gameStatus === 'playing') {
      dispatch(makeMove({ x, y }));
      if (gameId) {
        dispatch(updateGame({ gameId, gameData: { board, currentPlayer, gameStatus, username, currentUser, moves }}));
      }
    }
  }

  const handleLeave = async () => {
    try {
      let winner: 'Black' | 'White' | 'Draw' | null = null;
      const date = new Date().toISOString();
      const user = username;
  
      // Determine the winner based on the game status
      if (gameStatus === 'win') {
        winner = currentPlayer === 1 ? 'Black' : 'White';
      } else if (gameStatus === 'draw') {
        winner = 'Draw';
      }
  
    //   // Save game details locally (you can remove this if not needed)
      if ((gameStatus === 'win' || gameStatus === 'draw') && moves !== null) {
        saveGameDetails(board, date, winner, moves, user, currentUser!);
      }
  
      // Prepare the game data to be saved
      const gameData = {
        board,
        winner,
        date,
        username: user,
        moves,
        result: winner,
        boardSize: currentBoardSize,
        currentPlayer,
        gameStatus,
        currentUser: user,
        gamesList: []
      };
  
      // Dispatch the action to create a new game entry in the database
      const action = await dispatch(createGame(gameData));
      if (createGame.fulfilled.match(action)) {
        setGameId(action.payload._id);
      }
      navigate('/');
  
      // Reset the game board (optional)
      dispatch(restartGame(currentBoardSize));
    } catch (error) {
      console.error("An error occurred while saving game details:", error);
    }
  };
  

  const handleRestartGame = async () => {
    const date = new Date().toISOString();

    if (gameStatus === 'win' || gameStatus === 'draw') {
      let winner: 'Black' | 'White' | 'Draw' | null = null;
  
      if (gameStatus === 'win') {
        winner = currentPlayer === 1 ? 'Black' : 'White';
      } else if (gameStatus === 'draw') {
        winner = 'Draw';
      }
  
      const gameData = {
        board,
        winner,
        date,
        username,
        moves,
        result: winner,
        boardSize: currentBoardSize,
        currentPlayer,
        gameStatus,
        currentUser: username,
        gamesList: []
      };
  
      try {
        if (moves !== null) {
          const action = await dispatch(createGame(gameData));
          if (createGame.fulfilled.match(action)) {
            setGameId(action.payload._id);
          }
        }
      } catch (error) {
        console.error("An error occurred while saving game details:", error);
        return;
      }
      
      // Reset the game board
      dispatch(restartGame(currentBoardSize));
    }
  };
  

  useEffect(() => {
    const initialBoardSize = currentBoardSize;
    dispatch(restartGame(initialBoardSize));

    const fetchGamesList = async () => {
      
        if (token) {
          const response = await getGameByIdAndUserApi(token);
          dispatch(updateGamesList(response.data));
        }
   
    };

    fetchGamesList();
  }, [token, dispatch, username, currentBoardSize]);

  return (
    <div>
      <Header />
      <main className='container'>
        <h2>Current Player: {currentPlayer === 1 ? 'Black' : 'White'}</h2>
        {gameStatus === 'win' && <h2>Winner: {currentPlayer === 1 ? 'Black' : 'White'}</h2>}
        {gameStatus === 'draw' && <h2>Draw!</h2>}
        <div className="board">
          {board && board.map((row, y) => (
            <div className="row" key={y}>
              {row.map((cell, x) => (
                <div 
                  className={`cell ${cell === 1 ? 'black' : cell === 2 ? 'white' : ''}`} 
                  key={x}
                  onClick={() => handleCellClick(x, y)}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="controls">
          <div className="restart">
            <button onClick={handleRestartGame}>Restart</button>
          </div>
          <div className="leave">
            <button onClick={handleLeave}>Leave</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Game;
