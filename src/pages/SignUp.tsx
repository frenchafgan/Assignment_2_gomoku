import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate }  from 'react-router-dom';
import { signUp } from '../redux/auth/authSlice';
import Header from '../components/Header';
import '../styles/SignUp.css';
import { AppDispatch, RootState } from '../redux/store';




const SignUp: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get isAuthenticated from Redux store
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password === confirmPassword) {
            await dispatch(signUp({ username, password }));
        }
    };

    // Use useEffect to listen for changes in isAuthenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');  // Navigate to Home screen
        }
    }, [isAuthenticated, navigate]);
    

return (
    <div>
        <Header />
        <main className="signup-wrapper">
        <form className="login-main" onSubmit={handleSubmit}>
            <div className="signup-form">
            <label htmlFor="username">Username</label>
            <input
                
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div className="signup-form">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <div className="signup-form">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </div>
            <div className="signup-button">
            <button type="submit">Sign Up</button>
            </div> 
        </form>
        </main>
    </div>
    );
      
};

export default SignUp;
