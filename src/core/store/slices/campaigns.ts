import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchCampaigns as fetchCampaignsAxios,
  FetchCampaignsParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, CampaignPreview } from 'core/api/types';

export const campaignsSlice = createSlice({
  name: 'campaigns',

  initialState: {
    campaigns: null,
    count: null,
    isLoading: false,
    error: null,
  } as {
    campaigns?: CampaignPreview[];
    count?: number;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count;
        if (action.meta.arg?.offset > 0) {
          // fetched additional page of campaigns ("Show more")
          state.campaigns.push(...action.payload.results);
        } else {
          // fetched the first page of campaigns
          state.campaigns = action.payload.results;
        }
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setCampaigns, setIsLoading } = campaignsSlice.actions;

// Selectors
export const selectCampaigns = (state: AppState) => state.campaigns;

// API calls
export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async (params: FetchCampaignsParams, { rejectWithValue }) => {
    try {
      const response = await fetchCampaignsAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const campaignsReducer = campaignsSlice.reducer;
