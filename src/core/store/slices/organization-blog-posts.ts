import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchOrganizationBlogPosts as fetchOrganizationBlogPostsAxios,
  FetchOrganizationBlogPostsParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, BlogPostPreview } from 'core/api/types';

export const organizationBlogPostsSlice = createSlice({
  name: 'organizationBlogPosts',

  initialState: {
    organizationBlogPosts: null,
    count: null,
    isLoading: false,
    error: null,
  } as {
    organizationBlogPosts?: BlogPostPreview[];
    count?: number;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    setOrganizationBlogPosts: (state, action) => {
      state.organizationBlogPosts = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchOrganizationBlogPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationBlogPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count;
        if (action.meta.arg?.offset > 0) {
          // fetched additional page of organizationBlogPosts ("Show more")
          state.organizationBlogPosts.push(...action.payload.results);
        } else {
          // fetched the first page of organizationBlogPosts
          state.organizationBlogPosts = action.payload.results;
        }
      })
      .addCase(fetchOrganizationBlogPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setOrganizationBlogPosts, setIsLoading } =
  organizationBlogPostsSlice.actions;

// Selectors
export const selectOrganizationBlogPosts = (state: AppState) =>
  state.organizationBlogPosts;

// API calls
export const fetchOrganizationBlogPosts = createAsyncThunk(
  'organizationBlogPosts/fetchOrganizationBlogPosts',
  async (params: FetchOrganizationBlogPostsParams, { rejectWithValue }) => {
    try {
      const response = await fetchOrganizationBlogPostsAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const organizationBlogPostsReducer = organizationBlogPostsSlice.reducer;
