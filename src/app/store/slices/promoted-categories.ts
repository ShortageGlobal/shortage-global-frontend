import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import { fetchPromotedCategories as fetchPromotedCategoriesAxios } from 'app/api';
import { serizalizeAxiosError } from 'app/helpers';
import type { AxiosSerializedError, Category } from 'app/api/types';

export const promotedCategoriesSlice = createSlice({
  name: 'promotedCategories',

  initialState: {
    categories: null,
    isLoading: false,
    error: null,
    currentCategory: null,
  } as {
    categories?: Category[];
    isLoading: boolean;
    error?: AxiosSerializedError;
    currentCategory?: Category;
  },

  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
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
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setCurrentCategory } = promotedCategoriesSlice.actions;

// Selectors
export const selectPromotedCategories = (state: AppState) =>
  state.promotedCategories;

// API calls
export const fetchPromotedCategories = createAsyncThunk(
  'promotedCategories/fetchPromotedCategories',
  async (_params, { rejectWithValue }) => {
    try {
      const response = await fetchPromotedCategoriesAxios();
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const promotedCategoriesReducer = promotedCategoriesSlice.reducer;
