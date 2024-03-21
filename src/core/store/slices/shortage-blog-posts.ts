import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import {
  fetchShortageBlogPosts as fetchShortageBlogPostsAxios,
  FetchShortageBlogPostsParams,
} from 'core/api';
import { serizalizeAxiosError } from 'core/helpers';
import type {
  AxiosSerializedError,
  ShortageBlogPostPreview,
} from 'core/api/types';

export const shortageBlogPostsSlice = createSlice({
  name: 'shortageBlogPosts',

  initialState: {
    shortageBlogPosts: null,
    count: null,
    isLoading: false,
    error: null,
  } as {
    shortageBlogPosts?: ShortageBlogPostPreview[];
    count?: number;
    isLoading: boolean;
    error?: AxiosSerializedError;
  },

  reducers: {
    setShortageBlogPosts: (state, action) => {
      state.shortageBlogPosts = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchShortageBlogPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShortageBlogPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count;
        if (action.meta.arg?.offset > 0) {
          // fetched additional page of shortage blog posts ("Show more")
          state.shortageBlogPosts.push(...action.payload.results);
        } else {
          // fetched the first page of shortage blog posts
          state.shortageBlogPosts = action.payload.results;
        }
      })
      .addCase(fetchShortageBlogPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AxiosSerializedError;
      });
  },
});

// Actions
export const { setShortageBlogPosts, setIsLoading } =
  shortageBlogPostsSlice.actions;

// Selectors
export const selectShortageBlogPosts = (state: AppState) =>
  state.shortageBlogPosts;

// API calls
export const fetchShortageBlogPosts = createAsyncThunk(
  'shortageBlogPosts/fetchShortageBlogPosts',
  async (params: FetchShortageBlogPostsParams = {}, { rejectWithValue }) => {
    try {
      const response = await fetchShortageBlogPostsAxios(params);
      return response.data;
    } catch (rejection) {
      return rejectWithValue(serizalizeAxiosError(rejection));
    }
  }
);

// Reducer
export const shortageBlogPostsReducer = shortageBlogPostsSlice.reducer;
