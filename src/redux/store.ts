import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import gameReducer from './game/gameSlice';
import authReducer from './auth/authSlice';
import nameReducer from './user/userSlice';

export const store = configureStore({
    reducer: {
        game: gameReducer,
        auth: authReducer,
        name: nameReducer,
       
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
