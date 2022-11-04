import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import type { Profile } from 'core/api/types';

export const userSlice = createSlice({
  name: 'user',

  initialState: {
    profile: null,
    isProfileLoading: false,
  } as {
    profile?: Profile;
    isProfileLoading: boolean;
  },

  reducers: {
    setIsProfileLoading: (state, action) => {
      state.isProfileLoading = action.payload;
    },
    setProfile: (state, action) => {
      state.isProfileLoading = false;
      state.profile = action.payload;
    },
  },
});

// Actions
export const { setIsProfileLoading, setProfile } = userSlice.actions;

// Selectors
export const selectUser = (state: AppState) => state.user;

// Reducer
export const userReducer = userSlice.reducer;
