import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchAccountOrganizationProduct as fetchAccountOrganizationProductAxios,
  FetchAccountOrganizationProductParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, AccountProduct } from 'core/api/types';

export const accountProductSlice = createSlice({
  name: 'accountProduct',

  initialState: {
    product: null,
    isLoading: false,
    error: null,
  } as {
    product?: AccountProduct;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    patchProduct: (state, action) => {
      state.product = { ...state.product, ...action.payload };
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchAccountOrganizationProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountOrganizationProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchAccountOrganizationProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { patchProduct } = accountProductSlice.actions;

// Selectors
export const selectAccountProduct = (state: AppState) => state.accountProduct;

// API calls
export const fetchAccountOrganizationProduct = createAsyncThunk(
  'accountProduct/fetchAccountOrganizationProduct',
  async (
    params: FetchAccountOrganizationProductParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchAccountOrganizationProductAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const accountProductReducer = accountProductSlice.reducer;
