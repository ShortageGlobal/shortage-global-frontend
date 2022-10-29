import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchOrganization as fetchOrganizationAxios,
  FetchOrganizationParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, Organization } from 'core/api/types';

export const organizationSlice = createSlice({
  name: 'organization',

  initialState: {
    organization: null,
    isLoading: false,
    error: null,
  } as {
    organization?: Organization;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organization = action.payload;
      })
      .addCase(fetchOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Selectors
export const selectOrganization = (state: AppState) => state.organization;

// API calls
export const fetchOrganization = createAsyncThunk(
  'organization/fetchOrganization',
  async (params: FetchOrganizationParams, { rejectWithValue }) => {
    try {
      const response = await fetchOrganizationAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const organizationReducer = organizationSlice.reducer;
