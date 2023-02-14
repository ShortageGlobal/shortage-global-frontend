import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchAccountDeliveryInstructions as fetchAccountDeliveryInstructionsAxios,
  FetchAccountDeliveryInstructionsParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type {
  AxiosSerializedError,
  AccountDeliveryInstruction,
} from 'core/api/types';

export const accountDeliveryInstructionsSlice = createSlice({
  name: 'accountDeliveryInstructions',

  initialState: {
    deliveryInstructions: null,
    isLoading: false,
    error: null,
  } as {
    deliveryInstructions?: AccountDeliveryInstruction[];
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    addDeliveryInstruction: (state, action) => {
      state.deliveryInstructions.push(action.payload);
    },
    patchDeliveryInstruction: (state, action) => {
      const { id, patch } = action.payload;
      state.deliveryInstructions = state.deliveryInstructions.map(
        (instruction) => {
          return instruction.id === id
            ? { ...instruction, ...patch }
            : instruction;
        }
      );
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchAccountDeliveryInstructions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountDeliveryInstructions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deliveryInstructions = action.payload;
      })
      .addCase(fetchAccountDeliveryInstructions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { addDeliveryInstruction, patchDeliveryInstruction } =
  accountDeliveryInstructionsSlice.actions;

// Selectors
export const selectAccountDeliveryInstructions = (state: AppState) =>
  state.accountDeliveryInstructions;

// API calls
export const fetchAccountDeliveryInstructions = createAsyncThunk(
  'accountDeliveryInstructions/fetchAccountDeliveryInstructions',
  async (
    params: FetchAccountDeliveryInstructionsParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchAccountDeliveryInstructionsAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const accountDeliveryInstructionsReducer =
  accountDeliveryInstructionsSlice.reducer;
