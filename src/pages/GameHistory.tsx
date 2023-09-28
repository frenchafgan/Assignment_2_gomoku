import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
import Header from '../components/Header';
import GameHistoryRow from '../components/GameHistoryRow';
import '../styles/GameHistory.css';
import { username } from './Login'; // Import the selector


const GameHistory: React.FC = () => {
  const [userGameLogs, setUserGameLogs] = useState<[]>([]);
  const currentUser = username;

  useEffect(() => {
    // Fetch games from the server based on the username
    axios.get(`/game/user/${currentUser}`)
      .then(response => {
        setUserGameLogs(response.data);
      })
      .catch(error => {
        console.error("Error fetching games:", error);
      });
  }, [currentUser]);

  return (
    <div> 
      <Header />
      <main className='game-history-container'> 
        {userGameLogs.map((game: any, index) => (
          <GameHistoryRow 
            key={game.id || index}    
            id={game.id}
            dateAndTime={new Date(game.dateAndTime)}
            winner={game.result}
          />
        ))}
        {userGameLogs.length === 0 && <p>No game logs found.</p>}
      </main>
    </div>
  );
}

export default GameHistory;
