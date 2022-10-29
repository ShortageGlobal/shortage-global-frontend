import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchProducts as fetchProductsAxios,
  FetchProductsParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, ProductPreview } from 'core/api/types';

export const productsSlice = createSlice({
  name: 'products',

  initialState: {
    products: null,
    count: null,
    isLoading: false,
    error: null,
  } as {
    products?: ProductPreview[];
    count?: number;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count;
        if (action.meta.arg?.offset > 0) {
          // fetched additional page of products ("Show more")
          state.products.push(...action.payload.results);
        } else {
          // fetched the first page of products (swithed categories, changed search query)
          state.products = action.payload.results;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setProducts, setIsLoading } = productsSlice.actions;

// Selectors
export const selectProducts = (state: AppState) => state.products;

// API calls
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: FetchProductsParams, { rejectWithValue }) => {
    try {
      const response = await fetchProductsAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const productsReducer = productsSlice.reducer;
