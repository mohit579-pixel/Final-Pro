import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import voiceCommandReducer from "./voiceCommandSlice";
import notificationReducer from "./slices/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    voiceCommand: voiceCommandReducer,
    notifications: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = {
  auth: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
    } | null;
    token: string | null;
    isAuthenticated: boolean;
  };
  notifications: {
    notifications: any[];
    unreadCount: number;
  };
};

export type AppDispatch = typeof store.dispatch;

export default store; 