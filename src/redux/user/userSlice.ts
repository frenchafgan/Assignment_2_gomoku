import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  username: string;
  error?: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  username: '',
  error: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ username: string; password: string }>
    ) {
      const { username, password } = action.payload;
      if (username === 'admin' && password === 'admin') {
        state.isAuthenticated = true;
        state.username = username;
        state.error = undefined;
      } else {
        state.error = 'Incorrect login details. Try again';
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = '';
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
export const username = (state: any) => state.user.username;
