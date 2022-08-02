import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import { fetchPromotedCategories as fetchPromotedCategoriesAxios } from 'app/api';
import type { Category } from 'app/api/types';

export const promotedCategoriesSlice = createSlice({
  name: 'promotedCategories',

  initialState: {
    categories: null,
    isLoading: false,
    error: null,
  } as {
    categories?: Category[];
    isLoading: boolean;
    error?: unknown;
  },

  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPromotedCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromotedCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchPromotedCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

// Actions
export const { setCategories } = promotedCategoriesSlice.actions;

// Selectors
export const selectPromotedCategories = (state: AppState) =>
  state.promotedCategories;

export const fetchPromotedCategories = createAsyncThunk(
  'promotedCategories/fetchPromotedCategories',
  async () => {
    const response = await fetchPromotedCategoriesAxios();
    return response.data;
  }
);

export const promotedCategoriesReducer = promotedCategoriesSlice.reducer;
