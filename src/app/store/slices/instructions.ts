import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import {
  fetchInstructions as fetchInstructionsAxios,
  FetchInstructionsParams,
} from 'app/api';
import { serizalizeAxiosError } from 'app/helpers';
import type {
  Organization,
  Instruction,
  AxiosSerializedError,
} from 'app/api/types';

export const instructionsSlice = createSlice({
  name: 'instructions',

  initialState: {
    instructions: null,
    isInstructionsLoading: false,
    error: null,
  } as {
    instructions?: Record<Organization['slug'], Instruction[]>;
    isInstructionsLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchInstructions.pending, (state) => {
        state.isInstructionsLoading = true;
        state.error = null;
      })
      .addCase(fetchInstructions.fulfilled, (state, action) => {
        state.isInstructionsLoading = false;
        state.instructions = action.payload;
      })
      .addCase(fetchInstructions.rejected, (state, action) => {
        state.isInstructionsLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Selectors
export const selectInstructions = (state: AppState) => state.instructions;

// API calls
export const fetchInstructions = createAsyncThunk(
  'instructions/fetchInstructions',
  async (params: FetchInstructionsParams, { rejectWithValue }) => {
    try {
      const response = await fetchInstructionsAxios(params);
      return response;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const instructionsReducer = instructionsSlice.reducer;
