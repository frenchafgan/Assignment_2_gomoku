import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/GameLog.css';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import Header from '../components/Header';


interface Move {
    x: number;
    y: number;
    color: string;
    player: number;
}
interface GameLogProps {
}

interface GameDetails {
    id: number;
    boardSize: number;
    result: string;
    moves: Move[];
}

const GameLog: React.FC<GameLogProps> = () => {
    const { id } = useParams<{ id: string }>();
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    useEffect(() => {
        if (id && currentUser) {
            // Fetch the game details from the API
            fetch(`/api/game/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers here, like Authorization
                },
            })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.username === currentUser) {
                    setGameDetails(data);
                }
            })
            .catch((error) => {
                console.error('Error fetching game:', error);
            });
        }
    }, [id, currentUser]);
      

    const renderCell = (x: number, y: number, cellColor: string) => {
        if (!gameDetails) {
            throw new Error("Game details must not be null when rendering cells.");
          }

        const move = gameDetails.moves.find((m: Move) => m.x === x && m.y === y);

            if (move) {
            return (
                <div className={`cell ${move.color}`} key={`${x}-${y}`}>
                <span className="stone-number">{gameDetails.moves.indexOf(move) + 1}</span>
                </div>
            );
            }
            return <div className={`cell ${cellColor}`} key={`${x}-${y}`} />;
        };

    if (!gameDetails) {
        return <div>Play a game first to see the log</div>;
        }

   

    return (
        <div>
            <Header />
           
                 <div className="container">
                     <div className="game-info">Winner: {gameDetails.result}</div>
      
                <div className="board">
                {Array.from({ length: gameDetails.boardSize }).map((_, y) => (
                    <div className="row" key={y}>
                        {Array.from({ length: gameDetails.boardSize }).map((_, x) => (
                            renderCell(x, y, 'empty')
                        ))}
                    </div>
                ))}
                </div>
            </div>
            <div className="container">
                <div className="back-button">
                    <button onClick={() => navigate('/games')}>Back</button>
                </div>
            </div>
         
        </div>
    );
};

export default GameLog;
