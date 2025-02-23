import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";
// import courseSliceReducer from "./courseSlice";
// import lectureSliceReducer from "./lectureSlice";
// import razorpaySliceReducer from "./razorpaySlice";
// import statSliceReducer from "./statSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    // course: courseSliceReducer,
    // lecture: lectureSliceReducer,
    // razorpay: razorpaySliceReducer,
    // stat: statSliceReducer,
  },
});

export default store;
