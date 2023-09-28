import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { login, clearError } from '../redux/auth/authSlice';  // Import clearError
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Login.css';
import { AppDispatch } from '../redux/store';
import { username } from '../redux/user/userSlice';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const error = useSelector((state: RootState) => state.auth.error);
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    const handleInputChange = () => {
        if (error) {
            dispatch(clearError());  // Clear the error when the user starts typing
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(login({ username, password }));
        console.log(username);
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate, username]);

    return (
        <div>
            <Header />
            <main className="login-main">
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        className="login-input"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); handleInputChange(); }}
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
                    />
                    <button className="login-button" type="submit">Login</button>
                    {error && <p className="login-error">{error}</p>}
                </form>
            </main>
        </div>
    );
};

export default Login;
export { username };