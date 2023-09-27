import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setBoardSize } from '../redux/game/gameSlice';
import Header from '../components/Header';
import { AppDispatch } from '../redux/store';
import { createGame } from '../redux/game/gameSlice';
// import GameState from '../redux/game/gameSlice';


const Home: React.FC = () => {
    const [selectedBoardSize, setSelectedBoardSize] = useState<number | null>(null);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const savedBoardSize = localStorage.getItem('boardSize');
        const initialBoardSize = savedBoardSize ? JSON.parse(savedBoardSize) : 10;  // Default to 10 if not set
        setSelectedBoardSize(initialBoardSize);  // Update local state
        dispatch(setBoardSize(initialBoardSize));  // Update Redux state
    }, [dispatch]);

    const handleStartGame = async () => {
        if (selectedBoardSize !== null) {
            // Prepare the game data to be sent to the API
            // Make the API call to create a new game
            try {
                const response = createGame();
                console.log("Game created successfully:", response);
            } catch (error) {
                console.error("Error creating game:", error);
            }

            // Update Redux state here
            dispatch(setBoardSize(selectedBoardSize));
        }

        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate('/game');
        }
    };

    const handleBoardSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(event.target.value, 5);
        setSelectedBoardSize(newSize);  
    };
      
    return (
        <div>
            <Header />
            <main>
                <select
                    
                    value={selectedBoardSize ?? 'Board Size'}
                    onChange={handleBoardSizeChange}
                    style={{ width: '50%', margin: '0 25%' }}
                >
                    <option disabled>Board Size</option>
                    {Array.from({ length: 15 }).map((_, idx) => (
                        <option key={idx} value={idx + 5}>
                            {idx + 5}
                        </option>
                    ))}
                </select>
                <button onClick={handleStartGame} style={{ width: '50%', margin: '10px 25%' }}>
                    Start
                </button>
            </main>
        </div>
    );
}

export default Home;
