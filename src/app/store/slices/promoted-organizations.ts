import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import { fetchPromotedOrganizations as fetchPromotedOrganizationsAxios } from 'app/api';
import { serizalizeAxiosError } from 'app/helpers';
import type { AxiosSerializedError, OrganizationPreview } from 'app/api/types';

export const promotedOrganizationsSlice = createSlice({
  name: 'promotedOrganizations',

  initialState: {
    organizations: null,
    count: null,
    isLoading: false,
    error: null,
  } as {
    organizations?: OrganizationPreview[];
    count?: number;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    setOrganizations: (state, action) => {
      state.organizations = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPromotedOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromotedOrganizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(fetchPromotedOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setOrganizations } = promotedOrganizationsSlice.actions;

// Selectors
export const selectPromotedOrganizations = (state: AppState) =>
  state.promotedOrganizations;

// API calls
export const fetchPromotedOrganizations = createAsyncThunk(
  'promotedOrganizations/fetchPromotedOrganizations',
  async (_params, { rejectWithValue }) => {
    try {
      const response = await fetchPromotedOrganizationsAxios();
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const promotedOrganizationsReducer = promotedOrganizationsSlice.reducer;
