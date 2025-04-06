import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";
import voiceCommandReducer from "./voiceCommandSlice";
import notificationReducer from "./notificationSlice";
// import courseSliceReducer from "./courseSlice";
// import lectureSliceReducer from "./lectureSlice";
// import razorpaySliceReducer from "./razorpaySlice";
// import statSliceReducer from "./statSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    voiceCommand: voiceCommandReducer,
    notifications: notificationReducer,
    // course: courseSliceReducer,
    // lecture: lectureSliceReducer,
    // razorpay: razorpaySliceReducer,
    // stat: statSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
