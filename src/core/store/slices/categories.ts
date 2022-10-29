import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchCategories as fetchCategoriesAxios,
  FetchCategoriesParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, Category } from 'core/api/types';

export const categoriesSlice = createSlice({
  name: 'categories',

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
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setCurrentCategory } = categoriesSlice.actions;

// Selectors
export const selectCategories = (state: AppState) => state.categories;

// API calls
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params: FetchCategoriesParams, { rejectWithValue }) => {
    try {
      const response = await fetchCategoriesAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const categoriesReducer = categoriesSlice.reducer;
