import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'core/store';

export const searchSlice = createSlice({
  name: 'search',

  initialState: {
    searchQuery: '',
    isSearchInputFocused: false,
  } as {
    searchQuery: string;
    isSearchInputFocused: boolean;
  },

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setIsSearchInputFocused: (state, action) => {
      state.isSearchInputFocused = action.payload;
    },
  },
});

// Actions
export const { setSearchQuery, setIsSearchInputFocused } = searchSlice.actions;

// Selectors
export const selectSearch = (state: AppState) => state.search;

// Reducer
export const searchReducer = searchSlice.reducer;
