import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchPackageBlogPosts as fetchPackageBlogPostsAxios,
  FetchPackageBlogPostsParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, BlogPostPreview } from 'core/api/types';

export const packageBlogPostsSlice = createSlice({
  name: 'packageBlogPosts',

  initialState: {
    packageBlogPosts: null,
    isLoading: false,
    error: null,
  } as {
    packageBlogPosts?: BlogPostPreview[];
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchPackageBlogPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackageBlogPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packageBlogPosts = action.payload;
      })
      .addCase(fetchPackageBlogPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Selectors
export const selectPackageBlogPosts = (state: AppState) =>
  state.packageBlogPosts;

// API calls
export const fetchPackageBlogPosts = createAsyncThunk(
  'packageBlogPosts/fetchPackageBlogPosts',
  async (params: FetchPackageBlogPostsParams, { rejectWithValue }) => {
    try {
      const response = await fetchPackageBlogPostsAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const packageBlogPostsReducer = packageBlogPostsSlice.reducer;
