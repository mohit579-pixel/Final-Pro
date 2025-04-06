import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startListening, stopListening } from '../Redux/voiceCommandSlice';
import { voiceCommandService } from '../services/voiceCommandService';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const VoiceCommandButton = () => {
  const dispatch = useDispatch();
  const { isListening, error } = useSelector((state) => state.voiceCommand);

  useEffect(() => {
    return () => {
      voiceCommandService.stopListening();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      voiceCommandService.stopListening();
      dispatch(stopListening());
    } else {
      voiceCommandService.startListening();
      dispatch(startListening());
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-all duration-300 ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-blue-500 hover:bg-blue-600'
      } text-white z-50`}
      aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
    >
      {isListening ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
      {error && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-100 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}
    </button>
  );
};

export default VoiceCommandButton; 