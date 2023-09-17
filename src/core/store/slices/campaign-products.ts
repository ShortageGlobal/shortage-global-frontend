import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchCampaignProducts as fetchCampaignProductsAxios,
  FetchCampaignProductsParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, ProductPreview } from 'core/api/types';

export const campaignProductsSlice = createSlice({
  name: 'campaignProducts',

  initialState: {
    campaignProducts: null,
    count: null,
    isLoading: false,
    error: null,
  } as {
    campaignProducts?: ProductPreview[];
    count?: number;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    setCampaignProducts: (state, action) => {
      state.campaignProducts = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchCampaignProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count;
        if (action.meta.arg?.offset > 0) {
          // fetched additional page of campaign products ("Show more")
          state.campaignProducts.push(...action.payload.results);
        } else {
          // fetched the first page of campaign products (swithed categories, changed search query)
          state.campaignProducts = action.payload.results;
        }
      })
      .addCase(fetchCampaignProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setCampaignProducts, setIsLoading } =
  campaignProductsSlice.actions;

// Selectors
export const selectCampaignProducts = (state: AppState) =>
  state.campaignProducts;

// API calls
export const fetchCampaignProducts = createAsyncThunk(
  'campaignProducts/fetchCampaignProducts',
  async (params: FetchCampaignProductsParams, { rejectWithValue }) => {
    try {
      const response = await fetchCampaignProductsAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const campaignProductsReducer = campaignProductsSlice.reducer;
