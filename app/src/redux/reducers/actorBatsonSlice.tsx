import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Actor, getCandidatesActorsService } from '../../services/actors';
import { RootState } from '../store/Store';

export interface ActorBatsonState {
  file: {
    path: string;
    mime: string;
  };
  fetchingActorsCandidates: boolean;
  fetchProgress: {
    step: number;
    duration: number;
  };
  error: boolean;
  candidates: Actor[] | null;
}

const initialState: ActorBatsonState = {
  file: {
    path: '',
    mime: '',
  },
  error: false,
  fetchingActorsCandidates: false,
  fetchProgress: {
    step: 0,
    duration: 0,
  },
  candidates: null,
};

export const TimeEndAnimation = 500;

const getCandidates = createAsyncThunk(
  'actorBatson/getCandidates',
  async (_params, { getState }): Promise<Actor[]> => {
    const rootState = getState() as RootState;
    const {
      file: { path, mime },
    } = rootState.actorBatson as ActorBatsonState;
    const candidates = await getCandidatesActorsService(path, mime);
    if (candidates === null || candidates.length === 0) {
      return [];
    }
    return candidates;
  },
);

const actorBatsonSlice = createSlice({
  name: 'actorBatson',
  initialState,
  reducers: {
    initActorBatson: (
      state,
      action: PayloadAction<{ file: ActorBatsonState['file'] }>,
    ) => {
      state.file = action.payload.file;
      state.candidates = null;
      state.error = false;
      state.fetchingActorsCandidates = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCandidates.pending, state => {
        state.fetchingActorsCandidates = true;
        state.candidates = null;
        state.error = false;
        state.fetchProgress = {
          step: 7,
          duration: 8000,
        };
      })
      .addCase(getCandidates.fulfilled, (state, { payload }) => {
        state.candidates = payload;
        state.fetchingActorsCandidates = false;
        state.fetchProgress = {
          step: 10,
          duration: TimeEndAnimation,
        };
      })
      .addCase(getCandidates.rejected, state => {
        state.fetchingActorsCandidates = false;
        state.error = true;
        state.fetchProgress = {
          step: 10,
          duration: TimeEndAnimation,
        };
      });
  },
});

export { getCandidates };
export const { initActorBatson } = actorBatsonSlice.actions;
export const selectActorBatson = (state: RootState) => state.actorBatson;
export default actorBatsonSlice.reducer;
