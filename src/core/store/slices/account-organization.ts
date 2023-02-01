import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchAccountOrganization as fetchAccountOrganizationAxios,
  FetchAccountOrganizationParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, AccountOrganization } from 'core/api/types';

export const accountOrganizationSlice = createSlice({
  name: 'accountOrganization',

  initialState: {
    organization: null,
    isLoading: false,
    error: null,
  } as {
    organization?: AccountOrganization;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchAccountOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organization = action.payload;
      })
      .addCase(fetchAccountOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Selectors
export const selectAccountOrganization = (state: AppState) =>
  state.accountOrganization;

// API calls
export const fetchAccountOrganization = createAsyncThunk(
  'accountOrganization/fetchAccountOrganization',
  async (params: FetchAccountOrganizationParams, { rejectWithValue }) => {
    try {
      const response = await fetchAccountOrganizationAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const accountOrganizationReducer = accountOrganizationSlice.reducer;
