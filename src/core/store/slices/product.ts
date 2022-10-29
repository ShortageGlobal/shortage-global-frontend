import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchProduct as fetchProductAxios,
  FetchProductParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, Product } from 'core/api/types';

export const productSlice = createSlice({
  name: 'product',

  initialState: {
    product: null,
    isLoading: false,
    error: null,
  } as {
    product?: Product;
    isLoading: boolean;
    error?: AxiosSerializedError;
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
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Selectors
export const selectProduct = (state: AppState) => state.product;

// API calls
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (params: FetchProductParams, { rejectWithValue }) => {
    try {
      const response = await fetchProductAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const productReducer = productSlice.reducer;
