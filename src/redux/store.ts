import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import gameReducer from './game/gameSlice';
import authReducer from './auth/authSlice'; // Assuming you've also set up authentication slice
import userReducer from './user/userSlice'; // Assuming you've also set up user slice

export const store = configureStore({
  reducer: {
    game: gameReducer,
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
