import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchCampaignCategories as fetchCampaignCategoriesAxios,
  FetchCampaignCategoriesParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, Category } from 'core/api/types';

export const campaignCategoriesSlice = createSlice({
  name: 'campaignCategories',

  initialState: {
    campaignCategories: null,
    isLoading: false,
    error: null,
    currentCampaignCategory: null,
  } as {
    campaignCategories?: Category[];
    isLoading: boolean;
    error?: AxiosSerializedError;
    currentCampaignCategory?: Category;
  },

  reducers: {
    setCurrentCampaignCategory: (state, action) => {
      state.currentCampaignCategory = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchCampaignCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaignCategories = action.payload;
      })
      .addCase(fetchCampaignCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setCurrentCampaignCategory } = campaignCategoriesSlice.actions;

// Selectors
export const selectCampaignCategories = (state: AppState) =>
  state.campaignCategories;

// API calls
export const fetchCampaignCategories = createAsyncThunk(
  'campaignCategories/fetchCampaignCategories',
  async (params: FetchCampaignCategoriesParams, { rejectWithValue }) => {
    try {
      const response = await fetchCampaignCategoriesAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const campaignCategoriesReducer = campaignCategoriesSlice.reducer;
