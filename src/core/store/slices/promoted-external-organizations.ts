import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import { fetchPromotedExternalOrganizations as fetchPromotedExternalOrganizationsAxios } from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type {
  AxiosSerializedError,
  ExternalOrganizationPreview,
} from 'core/api/types';

export const promotedExternalOrganizationsSlice = createSlice({
  name: 'promotedExternalOrganizations',

  initialState: {
    externalOrganizations: null,
    isLoading: false,
    error: null,
  } as {
    externalOrganizations?: ExternalOrganizationPreview[];
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    setOrganizations: (state, action) => {
      state.externalOrganizations = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPromotedExternalOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPromotedExternalOrganizations.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.externalOrganizations = action.payload;
        }
      )
      .addCase(fetchPromotedExternalOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setOrganizations } = promotedExternalOrganizationsSlice.actions;

// Selectors
export const selectPromotedExternalOrganizations = (state: AppState) =>
  state.promotedExternalOrganizations;

// API calls
export const fetchPromotedExternalOrganizations = createAsyncThunk(
  'promotedExternalOrganizations/fetchPromotedExternalOrganizations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchPromotedExternalOrganizationsAxios();
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const promotedExternalOrganizationsReducer =
  promotedExternalOrganizationsSlice.reducer;
