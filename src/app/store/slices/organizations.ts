import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import { fetchPromotedOrganizations as fetchPromotedOrganizationsAxios } from 'app/api';

export const organizationsSlice = createSlice({
  name: 'organizations',

  initialState: {
    organizations: null,
    isLoading: false,
    error: null,
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
        state.organizations = action.payload;
      })
      .addCase(fetchPromotedOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

// Actions
export const { setOrganizations } = organizationsSlice.actions;

// Selectors
export const selectOrganizations = (state: AppState) => state.organizations;

export const fetchPromotedOrganizations = createAsyncThunk(
  'organizations/fetchPromotedOrganizations',
  async () => {
    const response = await fetchPromotedOrganizationsAxios();
    return response.data;
  }
);

export const organizationsReducer = organizationsSlice.reducer;
