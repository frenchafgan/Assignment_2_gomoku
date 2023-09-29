import axios from 'axios';
import { store } from './redux/store';
// import userSlice from './redux/user/userSlice';
import { username } from './pages/Login'; // Import the selector

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001', // Use environment variable, fallback to localhost
});

// Function to get token from reduxstore
const getToken = () => {
  const state = store.getState();
  return state.auth.token;
};

// export const getUserName = () => {
//   const state = store.getState();
//   return username(state); // Use the selector to get the username
// };

export const setupAxios = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
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
    headers: { Authorization: ` ${getToken()}` },
  });
};

export const createGame = (gameData: any) => {
  const { token } = gameData;
  const headers = { Authorization: `${token}` };

  return api.post('game/create', gameData, {
    headers: headers,
  });
};

export const restartGame = (
  gameId: string,
  gameData: any,
  token: string | null
) => {
  const headers = token ? { Authorization: `${token}` } : undefined;
  return api.post(`game/restart/${gameId}`, gameData, {
    headers: headers,
  });
};

export const updateGame = (gameId: string, gameData: any) => {
  return api.put(`/game/update/${gameId}`, gameData, {
    headers: { Authorization: ` ${getToken()}` },
  });
};

export const getGamesList = (token: string) => {
  return api.get(`games/${username}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const getSingleGame = (gameId: string) => {
  return api.get(`game/${gameId}`, {
    headers: { Authorization: ` ${getToken()}` },
  });
};

export const getGameByIdAndUserApi = async (
  id: string,
  username: string,
  token: string
) => {
  const config = {
    headers: {
      Authorization: `${token}`,
    },
  };
  const response = await axios.get(`/api/game/${id}/${username}`, config);
  return response;
};
