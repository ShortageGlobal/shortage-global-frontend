import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'app/store';
import type { WidgetState } from '@livechat/widget-react';

export const liveChatSlice = createSlice({
  name: 'liveChat',

  initialState: {
    visibility: 'minimized',
  } as {
    visibility: WidgetState['visibility'];
  },

  reducers: {
    setChatVisibility: (state, action) => {
      state.visibility = action.payload;
    },
    toggleLiveChat: (state) => {
      state.visibility =
        state.visibility === 'minimized' ? 'maximized' : 'minimized';
    },
  },
});

// Actions
export const { setChatVisibility, toggleLiveChat } = liveChatSlice.actions;

// Selectors
export const selectLiveChat = (state: AppState) => state.liveChat;

// Reducer
export const liveChatReducer = liveChatSlice.reducer;
