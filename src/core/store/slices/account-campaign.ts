import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchAccountOrganizationCampaign as fetchAccountOrganizationCampaignAxios,
  FetchAccountCampaignParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, AccountCampaign } from 'core/api/types';

export const accountCampaignSlice = createSlice({
  name: 'accountCampaign',

  initialState: {
    campaign: null,
    isLoading: false,
    error: null,
  } as {
    campaign?: AccountCampaign;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    patchCampaign: (state, action) => {
      state.campaign = { ...state.campaign, ...action.payload };
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchAccountOrganizationCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountOrganizationCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaign = action.payload;
      })
      .addCase(fetchAccountOrganizationCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { patchCampaign } = accountCampaignSlice.actions;

// Selectors
export const selectAccountCampaign = (state: AppState) => state.accountCampaign;

// API calls
export const fetchAccountOrganizationCampaign = createAsyncThunk(
  'accountCampaign/fetchAccountOrganizationCampaign',
  async (params: FetchAccountCampaignParams, { rejectWithValue }) => {
    try {
      const response = await fetchAccountOrganizationCampaignAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const accountCampaignReducer = accountCampaignSlice.reducer;
