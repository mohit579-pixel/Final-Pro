import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../Helper/axiosInstance';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'appointment' | 'reminder' | 'treatment' | 'payment' | 'general';
  isRead: boolean;
  createdAt: string;
  linkTo?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    currentPage: number;
    limit: number;
    pages: number;
    unreadCount: number;
  };
}

interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    unreadCount: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

// Async thunks
export const fetchNotifications = createAsyncThunk<NotificationResponse, string>(
  'notifications/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notifications/user/${userId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch notifications' });
    }
  }
);

export const deleteNotification = createAsyncThunk<string, string>(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete notification' });
    }
  }
);

export const markAsRead = createAsyncThunk<Notification, string>(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to mark notification as read' });
    }
  }
);

export const markAllAsRead = createAsyncThunk<{ userId: string }, string>(
  'notifications/markAllAsRead',
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/notifications/user/${userId}/read-all`);
      return { userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to mark all notifications as read' });
    }
  }
);

// Initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    currentPage: 1,
    limit: 10,
    pages: 1,
    unreadCount: 0
  }
};

// Create the slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
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
        const deletedNotification = state.notifications.find(
          notification => notification._id === action.payload
        );
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  }
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer; 