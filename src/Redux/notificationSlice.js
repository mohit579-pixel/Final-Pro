import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../Helper/axiosInstance';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notifications/user/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch notifications' });
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete notification' });
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to mark notification as read' });
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/notifications/user/${userId}/read-all`);
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to mark all notifications as read' });
    }
  }
);

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    currentPage: 1,
    limit: 10,
    pages: 1
  }
};

// Create the slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.pagination.unreadCount;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch notifications';
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(notif => notif._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          notification => notification._id !== action.payload
        );
        // Update unread count if the deleted notification was unread
        const wasUnread = state.notifications.some(
          notification => notification._id === action.payload && !notification.isRead
        );
        if (wasUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer; 