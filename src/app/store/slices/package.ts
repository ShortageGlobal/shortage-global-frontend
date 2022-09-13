import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import {
  fetchPackageStatus as fetchPackageStatusPackageAxios,
  FetchPackageStatusParams,
} from 'app/api';
import { serizalizeAxiosError } from 'app/helpers';
import type { AxiosSerializedError, Package } from 'app/api/types';

export const packageSlice = createSlice({
  name: 'package',

  initialState: {
    package: null,
    isLoading: false,
    error: null,
  } as {
    package?: Package;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.package = action.payload;
      })
      .addCase(fetchPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Selectors
export const selectPackage = (state: AppState) => state.package;

// API calls
export const fetchPackage = createAsyncThunk(
  'package/fetchPackage',
  async (params: FetchPackageStatusParams, { rejectWithValue }) => {
    try {
      const response = await fetchPackageStatusPackageAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const packageReducer = packageSlice.reducer;
