import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/Store';

type ColorType = 'LIGHT' | 'DARK';

const LIGHT_COLORS = {
  background: '#F6F6F6',

  primary: '#FFBA52',
  primaryDark: '#E99820',
  primaryTransparent: 'rgba(255, 186, 82, 0.3)',

  error: '#F44336',
  success: 'green',

  surface_dp1: '#FFFFFF',
  surface_dp2: '#FFFFFF',
  surface_dp3: '#FFFFFF',

  onSurfaceHighEmphasis: 'rgba(0, 0, 0, 0.87)',
  onSurfaceMediumEmphasis: 'rgba(0, 0, 0, 0.6)',
  onSurfaceDisabled: 'rgba(0, 0, 0, 0.38)',

  onPrimaryHighEmphasis: '#1F1F1F',
  onPrimaryMediumEmphasis: 'rgba(31, 31, 31, 0.74)',
  onPrimaryDisabled: 'rgba(31, 31, 31, 0.38)',

  invisible: 'rgba(0, 0, 0, 0)',

  textShownGradient: [
    'rgba(238, 238, 238, 1)',
    'rgba(238, 238, 238, 0.8)',
    'rgba(238, 238, 238, 0.8)',
    'rgba(238, 238, 238, 1)',
  ],

  textHiddenGradient: [
    'rgba(238, 238, 238, 0.4)',
    'rgba(238, 238, 238, 0)',
    'rgba(238, 238, 238, 0)',
    'rgba(238, 238, 238, 1)',
  ],
};

const DARK_COLORS = {
  background: '#121212',
  black: '#000000',

  primary: '#FFC875',
  primaryDark: '#E99820',
  primaryTransparent: 'rgba(255, 200, 117, 0.2)',

  error: '#F44336',
  success: 'green',

  surface_dp1: '#1E1E1E',
  surface_dp2: '#232323',
  surface_dp3: '#252525',

  onSurfaceHighEmphasis: 'rgba(255, 255, 255, 0.87)',
  onSurfaceMediumEmphasis: 'rgba(255, 255, 255, 0.6)',
  onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',

  onPrimaryHighEmphasis: '#000000',
  onPrimaryMediumEmphasis: 'rgba(0, 0, 0, 0.74)',
  onPrimaryDisabled: 'rgba(0, 0, 0, 0.38)',

  invisible: 'rgba(0, 0, 0, 0)',

  textShownGradient: [
    'rgba(12,12,12,1)',
    'rgba(12,12,12,0.8)',
    'rgba(12,12,12,0.8)',
    'rgba(12,12,12,1)',
  ],
  textHiddenGradient: [
    'rgba(12,12,12,0.4)',
    'rgba(12,12,12,0)',
    'rgba(12,12,12,0)',
    'rgba(12,12,12,1)',
  ],
};

export const COLORS = {
  LIGHT: LIGHT_COLORS,
  DARK: DARK_COLORS,
};

export interface ColorState {
  mode: ColorType;
  colors: {
    background: string;
    primary: string;
    primaryDark: string;
    primaryTransparent: string;
    error: string;
    success: string;
    surface_dp1: string;
    surface_dp2: string;
    surface_dp3: string;
    onSurfaceHighEmphasis: string;
    onSurfaceMediumEmphasis: string;
    onSurfaceDisabled: string;
    onPrimaryHighEmphasis: string;
    onPrimaryMediumEmphasis: string;
    onPrimaryDisabled: string;
    invisible: string;
    textShownGradient: string[];
    textHiddenGradient: string[];
  };
}

export const initialState: ColorState = {
  mode: 'DARK',
  colors: DARK_COLORS,
};

const colorSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    setColorMode: (state, action: PayloadAction<ColorType>) => {
      state.mode = action.payload;
      state.colors = COLORS[action.payload];
    },
  },
});

export const { setColorMode } = colorSlice.actions;
export const selectColorMode = (state: RootState) => state.colors;
export default colorSlice.reducer;
