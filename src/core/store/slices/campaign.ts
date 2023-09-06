import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchCampaign as fetchCampaignAxios,
  FetchCampaignParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, Campaign } from 'core/api/types';

export const campaignSlice = createSlice({
  name: 'campaign',

  initialState: {
    campaign: null,
    isLoading: false,
    error: null,
  } as {
    campaign?: Campaign;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaign = action.payload;
      })
      .addCase(fetchCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Selectors
export const selectCampaign = (state: AppState) => state.campaign;

// API calls
export const fetchCampaign = createAsyncThunk(
  'campaign/fetchCampaign',
  async (params: FetchCampaignParams, { rejectWithValue }) => {
    try {
      const response = await fetchCampaignAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const campaignReducer = campaignSlice.reducer;
