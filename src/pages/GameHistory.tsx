import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import GameHistoryRow from '../components/GameHistoryRow';
import '../styles/GameHistory.css';
import { getGameList } from '../api';  // Import the getGamesList function


interface GameLog {
  id: number;
  dateAndTime: string;
  winner: 'Black' | 'White' | null;
  username: string;
  token: string;
}

const GameHistory: React.FC = () => {
  const [userGameLogs, setUserGameLogs] = useState<GameLog[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await getGameList(token!);
        setUserGameLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch game history:', error);
      }
    };

    if (token) {
      fetchGameHistory();
    }
  }, [token]);

  return (
    <div>
      <Header />
      <main className='game-history-container'>
        {userGameLogs.map((game, index) => (
          <GameHistoryRow
            key={game.id || index}
            id={game.id}
            dateAndTime={new Date(game.dateAndTime)}
            winner={game.winner}
          />
        ))}
        {userGameLogs.length === 0 && <p>No game logs found.</p>}
      </main>
    </div>
  );
}

export default GameHistory;
