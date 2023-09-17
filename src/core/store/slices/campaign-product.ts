import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchCampaignProduct as fetchCampaignProductAxios,
  FetchCampaignProductParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, Product } from 'core/api/types';

export const campaignProductSlice = createSlice({
  name: 'campaignProduct',

  initialState: {
    campaignProduct: null,
    isLoading: false,
    error: null,
  } as {
    campaignProduct?: Product;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchCampaignProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaignProduct = action.payload;
      })
      .addCase(fetchCampaignProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Selectors
export const selectCampaignProduct = (state: AppState) => state.campaignProduct;

// API calls
export const fetchCampaignProduct = createAsyncThunk(
  'campaignProduct/fetchCampaignProduct',
  async (params: FetchCampaignProductParams, { rejectWithValue }) => {
    try {
      const response = await fetchCampaignProductAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const campaignProductReducer = campaignProductSlice.reducer;
