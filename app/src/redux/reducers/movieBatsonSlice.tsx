import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../../services/movies';
import { RootState } from '../store/Store';

export interface MovieBatsonState {
  file: {
    path: string;
    mime: string;
  };
  candidates: Movie[] | null;
  correctBatsonMovie: null | Movie;
  currentMovie: null | Movie;
}

const initialState: MovieBatsonState = {
  file: {
    path: '',
    mime: '',
  },
  candidates: null,
  correctBatsonMovie: null,
  currentMovie: null,
};

const movieBatsonSlice = createSlice({
  name: 'movieBatson',
  initialState,
  reducers: {
    initMovieBatson: (
      _state,
      action: PayloadAction<{ file: MovieBatsonState['file'] }>,
    ) => {
      return { ...initialState, file: action.payload.file };
    },
    setCandidatesMovies: (state, action: PayloadAction<Movie[] | null>) => {
      state.candidates = action.payload;
    },
    setCorrectMovie: (state, action: PayloadAction<Movie | null>) => {
      state.correctBatsonMovie = action.payload;
    },
    setCurrentMovie: (state, action: PayloadAction<Movie | null>) => {
      state.currentMovie = action.payload;
    },
  },
});

export const {
  initMovieBatson,
  setCorrectMovie,
  setCandidatesMovies,
  setCurrentMovie,
} = movieBatsonSlice.actions;
export const selectMovieBatson = (state: RootState) => state.movieBatson;
export default movieBatsonSlice.reducer;
