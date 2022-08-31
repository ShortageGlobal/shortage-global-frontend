import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import {
  fetchPromotedProducts as fetchPromotedProductsAxios,
  FetchPromotedProductsParams,
} from 'app/api';
import { serizalizeAxiosError } from 'app/helpers';
import type { AxiosSerializedError, ProductPreview } from 'app/api/types';

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
      .addCase(fetchPromotedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromotedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count;
        if (action.meta.arg?.offset > 0) {
          // fetched additional page of products ("Show more")
          state.products.push(...action.payload.results);
        } else {
          // fetched the first page of products (swithced categories, changed search query)
          state.products = action.payload.results;
        }
      })
      .addCase(fetchPromotedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setProducts, setIsLoading } = promotedProductsSlice.actions;

// Selectors
export const selectPromotedProducts = (state: AppState) =>
  state.promotedProducts;

// API calls
export const fetchPromotedProducts = createAsyncThunk(
  'promotedProducts/fetchPromotedProducts',
  async (params: FetchPromotedProductsParams = {}, { rejectWithValue }) => {
    try {
      const response = await fetchPromotedProductsAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const promotedProductsReducer = promotedProductsSlice.reducer;
