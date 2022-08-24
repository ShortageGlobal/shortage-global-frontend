import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import {
  fetchOnlineStores as fetchOnlineStoresAxios,
  FetchOnlineStoresParams,
} from 'app/api';
import { serizalizeAxiosError } from 'app/helpers';
import type { AxiosSerializedError, OnlineStore } from 'app/api/types';

export const onlineStoresSlice = createSlice({
  name: 'onlineStores',

  initialState: {
    onlineStores: null,
    isLoading: false,
    error: null,
  } as {
    onlineStores?: OnlineStore[];
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchOnlineStores.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOnlineStores.fulfilled, (state, action) => {
        state.isLoading = false;
        state.onlineStores = action.payload;
      })
      .addCase(fetchOnlineStores.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Selectors
export const selectOnlineStores = (state: AppState) => state.onlineStores;

// API calls
export const fetchOnlineStores = createAsyncThunk(
  'onlineStores/fetchOnlineStores',
  async (params: FetchOnlineStoresParams, { rejectWithValue }) => {
    try {
      const response = await fetchOnlineStoresAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const onlineStoresReducer = onlineStoresSlice.reducer;
