import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoiceCommandState {
  isListening: boolean;
  lastCommand: string | null;
  error: string | null;
}

const initialState: VoiceCommandState = {
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
    setLastCommand: (state, action: PayloadAction<string>) => {
      state.lastCommand = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { startListening, stopListening, setLastCommand, setError } = voiceCommandSlice.actions;
export default voiceCommandSlice.reducer; 