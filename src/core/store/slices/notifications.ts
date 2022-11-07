import { createSlice } from '@reduxjs/toolkit';
import { AppState } from 'core/store';
import type { Notification } from 'core/api/types';

export const notificationsSlice = createSlice({
  name: 'notifications',

  initialState: {
    notifications: [],
  } as {
    notifications?: Notification[];
  },

  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.key !== action.payload.key
      );
    },
  },
});

// Actions
export const { addNotification, removeNotification } =
  notificationsSlice.actions;

// Selectors
export const selectNotifications = (state: AppState) => state.notifications;

// Reducer
export const notificationsReducer = notificationsSlice.reducer;
