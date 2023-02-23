import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchAccountOrganizationPackage as fetchAccountOrganizationPackageAxios,
  FetchAccountOrganizationPackageParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type {
  AxiosSerializedError,
  AccountOrganizationPackage,
} from 'core/api/types';

export const accountOrganizationPackageSlice = createSlice({
  name: 'accountOrganizationPackage',

  initialState: {
    package: null,
    isLoading: false,
    error: null,
  } as {
    package?: AccountOrganizationPackage;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    patchPackage: (state, action) => {
      state.package = { ...state.package, ...action.payload };
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchAccountOrganizationPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountOrganizationPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.package = action.payload;
      })
      .addCase(fetchAccountOrganizationPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { patchPackage } = accountOrganizationPackageSlice.actions;

// Selectors
export const selectAccountOrganizationPackage = (state: AppState) =>
  state.accountOrganizationPackage;

// API calls
export const fetchAccountOrganizationPackage = createAsyncThunk(
  'accountOrganizationPackage/fetchAccountOrganizationPackage',
  async (
    params: FetchAccountOrganizationPackageParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchAccountOrganizationPackageAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const accountOrganizationPackageReducer =
  accountOrganizationPackageSlice.reducer;
