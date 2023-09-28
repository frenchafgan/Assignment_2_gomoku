// import { v4 as uuidv4 } from 'uuid';

interface Move {
  x: number;
  y: number;
  color: string;
  order: number;
}

// export const saveGameDetails = async (
//   board: number[][],
//   date: string,
//   winner: 'Black' | 'White' | 'Draw' | null,
//   moves: Move[],
//   username: string
// ) => {
//   // try {
//   // const token = localStorage.getItem('token'); // Replace with your token retrieval logic
//   // const uniqueId = uuidv4();
//   // const newGameId = uniqueId;
//   // const gameDetails = {
//   //   id: newGameId,
//   //   boardSize: board.length,
//   //   date: new Date().toISOString(),
//   //   result: winner ? winner : 'Draw',
//   //   moves: moves,
//   //   username: username,
//   // };
//   // const response = await fetch('/api/games/create', {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //     Authorization: `${token}`,
//   //   },
//   //   body: JSON.stringify(gameDetails),
//   // });
//   // if (!response.ok) {
//   //   throw new Error(`Failed to save game details: ${response.statusText}`);
//   // }
//   //   const savedGame = await response.json();
//   //   return savedGame;
//   // } catch (error) {
//   //   console.error('An error occurred while saving the game details:', error);
//   //   throw error;
// };

export const saveGameDetails = async (
  board: number[][],
  date: string,
  winner: 'Black' | 'White' | 'Draw' | null,
  moves: Move[],
  username: string,
  currentUser: string
) => {
  try {
    // const token = localStorage.getItem('token');
    // const uniqueId = uuidv4();
    // const newGameId = uniqueId;
    // const gameDetails = {
    //   id: newGameId,
    //   boardSize: board.length,
    //   date: new Date().toISOString(),
    //   result: winner ? winner : 'Draw',
    //   moves: moves,
    //   username: username,
    //   currentUser: currentUser, // <-- Add this field
    // };
  } catch (error) {
    console.error('An error occurred while saving the game details:', error);
    throw error;
  }
};

// Helper function to fetch the last game ID for the current user
// This can be replaced by your actual API call
// const fetchLastGameIdForUser = async (
//   currentUser: string | null
// ): Promise<number> => {
//   const response = await fetch(`/api/games/lastGameId?username=${currentUser}`);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch last game ID: ${response.statusText}`);
//   }
//   const lastGameId = await response.json();
//   return lastGameId;
// };

export const saveMove = (
  x: number,
  y: number,
  color: string,
  order: number
) => {
  const move: Move = { x, y, color, order };
  return move;
};

export const createMove = (
  x: number,
  y: number,
  currentPlayer: number,
  order: number
): Move => {
  return {
    x,
    y,
    color: currentPlayer === 1 ? 'black' : 'white',
    order,
  };
};

export const checkWin = (
  board: number[][],
  x: number,
  y: number,
  currentPlayer: number
): boolean => {
  const directions: [number, number][] = [
    [1, 0], // Horizontal
    [0, 1], // Vertical
    [1, 1], // Diagonal \
    [1, -1], // Diagonal /
  ];

  for (let [dx, dy] of directions) {
    let count = 1;

    // Check in the positive direction
    for (let i = 1; i < 5; i++) {
      if (
        board[y + dy * i] &&
        board[y + dy * i][x + dx * i] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }

    // Check in the negative direction
    for (let i = 1; i < 5; i++) {
      if (
        board[y - dy * i] &&
        board[y - dy * i][x - dx * i] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 5) return true;
  }

  return false;
};

export const isDraw = (board: number[][]): boolean => {
  for (let row of board) {
    for (let cell of row) {
      if (cell === 0) {
        return false;
      }
    }
  }
  return true;
};
