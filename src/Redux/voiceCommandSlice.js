import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isListening: false,
  lastCommand: null,
  error: null,
};

const voiceCommandSlice = createSlice({
  name: 'voiceCommand',
  initialState,
  reducers: {
    startListening: (state) => {
      state.isListening = true;
      state.error = null;
    },
    stopListening: (state) => {
      state.isListening = false;
    },
    setLastCommand: (state, action) => {
      state.lastCommand = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { startListening, stopListening, setLastCommand, setError } = voiceCommandSlice.actions;
export default voiceCommandSlice.reducer; 