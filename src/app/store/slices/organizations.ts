import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import { fetchOrganizations as fetchOrganizationsAxios } from 'app/services';

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
      .addCase(fetchOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

// Actions
export const { setOrganizations } = organizationsSlice.actions;

// Selectors
export const selectOrganizations = (state: AppState) => state.organizations;

export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchOrganizations',
  async () => {
    const response = await fetchOrganizationsAxios();
    return response.data;
  }
);

export const organizationsReducer = organizationsSlice.reducer;
