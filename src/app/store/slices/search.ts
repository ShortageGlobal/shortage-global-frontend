import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'app/store';

export const searchSlice = createSlice({
  name: 'search',

  initialState: {
    searchQuery: '',
  } as {
    searchQuery: string;
  },

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

// Actions
export const { setSearchQuery } = searchSlice.actions;

// Selectors
export const selectSearch = (state: AppState) => state.search;

// Reducer
export const searchReducer = searchSlice.reducer;
