import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'core/store';

export const accountSlice = createSlice({
  name: 'account',

  initialState: {
    user: null,
    isAuthenticated: false,
    isAccountLoading: false,
    registrationSuccess: false,
  } as {
    user?: null;
    isAuthenticated: boolean;
    isAccountLoading: boolean;
    registrationSuccess: boolean;
  },

  reducers: {
    setIsAccountLoading: (state, action) => {
      state.isAccountLoading = action.payload;
    },
  },
});

// Actions
export const { setIsAccountLoading } = accountSlice.actions;

// Selectors
export const selectAccount = (state: AppState) => state.account;

// Reducer
export const accountReducer = accountSlice.reducer;
