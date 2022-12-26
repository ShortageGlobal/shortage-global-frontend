import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchPromotedBlogPosts as fetchPromotedBlogPostsAxios,
  FetchPromotedBlogPostsParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type { AxiosSerializedError, BlogPostPreview } from 'core/api/types';

export const promotedBlogPostsSlice = createSlice({
  name: 'promotedBlogPosts',

  initialState: {
    promotedBlogPosts: null,
    count: null,
    isLoading: false,
    error: null,
  } as {
    promotedBlogPosts?: BlogPostPreview[];
    count?: number;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    setPromotedBlogPosts: (state, action) => {
      state.promotedBlogPosts = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPromotedBlogPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromotedBlogPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count;
        if (action.meta.arg?.offset > 0) {
          // fetched additional page of promoted blog posts ("Show more")
          state.promotedBlogPosts.push(...action.payload.results);
        } else {
          // fetched the first page of promoted blog posts
          state.promotedBlogPosts = action.payload.results;
        }
      })
      .addCase(fetchPromotedBlogPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setPromotedBlogPosts, setIsLoading } =
  promotedBlogPostsSlice.actions;

// Selectors
export const selectPromotedBlogPosts = (state: AppState) =>
  state.promotedBlogPosts;

// API calls
export const fetchPromotedBlogPosts = createAsyncThunk(
  'promotedBlogPosts/fetchPromotedBlogPosts',
  async (params: FetchPromotedBlogPostsParams = {}, { rejectWithValue }) => {
    try {
      const response = await fetchPromotedBlogPostsAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const promotedBlogPostsReducer = promotedBlogPostsSlice.reducer;
