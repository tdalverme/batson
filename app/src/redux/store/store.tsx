import { configureStore } from '@reduxjs/toolkit';
import actorBatsonSlice from '../reducers/actorBatsonSlice';
import colorsModeReducer from '../reducers/colorModeReducer';
import movieBatsonSlice from '../reducers/movieBatsonSlice';

export const store = configureStore({
  reducer: {
    actorBatson: actorBatsonSlice,
    movieBatson: movieBatsonSlice,
    colors: colorsModeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
