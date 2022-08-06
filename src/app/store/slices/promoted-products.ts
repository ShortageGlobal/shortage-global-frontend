import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import {
  fetchPromotedProducts as fetchPromotedProductsAxios,
  FetchPromotedProductsParams,
} from 'app/api';
import type { ProductPreview } from 'app/api/types';

export const promotedProductsSlice = createSlice({
  name: 'promotedProducts',

  initialState: {
    products: null,
    count: null,
    isLoading: false,
    error: null,
  } as {
    products?: ProductPreview[];
    count?: number;
    isLoading: boolean;
    error?: unknown;
  },

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPromotedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromotedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(fetchPromotedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

// Actions
export const { setProducts } = promotedProductsSlice.actions;

// Selectors
export const selectPromotedProducts = (state: AppState) =>
  state.promotedProducts;

export const fetchPromotedProducts = createAsyncThunk(
  'promotedProducts/fetchPromotedProducts',
  async (params: FetchPromotedProductsParams = {}) => {
    const response = await fetchPromotedProductsAxios(params);
    return response.data;
  }
);

export const promotedProductsReducer = promotedProductsSlice.reducer;
