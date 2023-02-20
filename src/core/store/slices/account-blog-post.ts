import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchAccountOrganizationBlogPost as fetchAccountOrganizationBlogPostAxios,
  FetchAccountBlogPostParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, AccountBlogPost } from 'core/api/types';

export const accountBlogPostSlice = createSlice({
  name: 'accountBlogPost',

  initialState: {
    blogPost: null,
    isLoading: false,
    error: null,
  } as {
    blogPost?: AccountBlogPost;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    patchBlogPost: (state, action) => {
      state.blogPost = { ...state.blogPost, ...action.payload };
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchAccountOrganizationBlogPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountOrganizationBlogPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogPost = action.payload;
      })
      .addCase(fetchAccountOrganizationBlogPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { patchBlogPost } = accountBlogPostSlice.actions;

// Selectors
export const selectAccountBlogPost = (state: AppState) => state.accountBlogPost;

// API calls
export const fetchAccountOrganizationBlogPost = createAsyncThunk(
  'accountBlogPost/fetchAccountOrganizationBlogPost',
  async (params: FetchAccountBlogPostParams, { rejectWithValue }) => {
    try {
      const response = await fetchAccountOrganizationBlogPostAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const accountBlogPostReducer = accountBlogPostSlice.reducer;
