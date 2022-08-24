import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import {
  fetchInstructions as fetchInstructionsAxios,
  FetchInstructionsParams,
} from 'app/api';
import { serizalizeAxiosError } from 'app/helpers';
import type { AxiosSerializedError, Instruction } from 'app/api/types';

export const instructionsSlice = createSlice({
  name: 'instructions',

  initialState: {
    instructions: null,
    isLoading: false,
    error: null,
  } as {
    instructions?: Instruction[];
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchInstructions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInstructions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.instructions = action.payload;
      })
      .addCase(fetchInstructions.rejected, (state, action) => {
        state.isLoading = false;
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
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const instructionsReducer = instructionsSlice.reducer;
