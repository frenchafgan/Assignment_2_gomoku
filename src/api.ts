import axios from 'axios';
import { store } from './redux/store';
import  GameState from './redux/game/gameSlice';

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: 'http://localhost:3001/', // Replace with your backend URL
});

// Function to get token from redux store
const getToken = () => {
  const state = store.getState();
  return state.auth.token;
};

// Add a request interceptor to include the token in every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export const signUp = (userData: any) => {
  return api.post('auth/signup', userData);
};

export const login = (userData: any) => {
  return api.post('auth/login', userData);
};

export const logout = () => {
  return api.post('logout', {
    headers: { Authorization: ` ${getToken()}` }
  });
};

export const createGame = (gameData: typeof GameState) => {  // Type the gameData parameter
  const token = gameData;  // Extract the token from gameData
  const headers = token ? { 'Authorization': `${token}` } : undefined;

  return api.post('game/create', gameData, {
    headers: headers
  });
};

export const restartGame = (gameId: string, gameData: typeof GameState, token: string | null) => {  // Type the gameData parameter
  const headers = token ? { 'Authorization': `${token}` } : undefined;
  return api.post(`game/restart/${gameId}`, gameData, {
    headers: headers
  });
};

export const saveGame = (gameData: typeof GameState) => {  // Type the gameData parameter
  return api.post('api/game/saveGame/', gameData, {
    headers: { Authorization: ` ${getToken()}` }
  });
};

export const updateGame = (gameId: string, gameData: typeof GameState) => {  // Type the gameData parameter
  return api.put(`/game/update/${gameId}`, gameData, {
    headers: { Authorization: ` ${getToken()}` }
  });
};

export const getGameList = (token: string) => {
  return api.get('/api/game', {
    headers: {
      'Authorization': `${token}`
    }
  });
};

export const getSingleGame = (gameId: string) => {
  return api.get(`/api/game/${gameId}`, {
    headers: { Authorization: ` ${getToken()}` }
  });
};
