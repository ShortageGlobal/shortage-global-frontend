import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import { fetchProduct as fetchProductAxios, FetchProductParams } from 'app/api';
import type { Product } from 'app/api/types';

export const productSlice = createSlice({
  name: 'product',

  initialState: {
    product: null,
    isLoading: false,
    error: null,
  } as {
    product?: Product;
    isLoading: boolean;
    error?: unknown;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

// Selectors
export const selectProduct = (state: AppState) => state.product;

// API calls
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (params: FetchProductParams) => {
    const response = await fetchProductAxios(params);
    return response.data;
  }
);

// Reducer
export const productReducer = productSlice.reducer;
