import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startListening, stopListening } from '../Redux/voiceCommandSlice';
import { voiceCommandService } from '../services/voiceCommandService';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { RootState } from '../Redux/store';
import toast from 'react-hot-toast';

const VoiceCommandButton = () => {
  const dispatch = useDispatch();
  const { isListening, error } = useSelector((state: RootState) => state.voiceCommand);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window)) {
      setIsSupported(false);
      toast.error('Voice commands are not supported in this browser');
    }

    // Cleanup on unmount
    return () => {
      if (isListening) {
        voiceCommandService.stopListening();
        dispatch(stopListening());
      }
    };
  }, [dispatch, isListening]);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error('Voice commands are not supported in this browser');
      return;
    }

    try {
      if (isListening) {
        voiceCommandService.stopListening();
        dispatch(stopListening());
      } else {
        voiceCommandService.startListening();
        dispatch(startListening());
      }
    } catch (error) {
      console.error('Error toggling voice commands:', error);
      toast.error('Failed to toggle voice commands');
    }
  };

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white relative`}
        aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
        title={isListening ? 'Stop voice commands' : 'Start voice commands'}
      >
        {isListening ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
      </button>
      {error && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-100 text-red-800 rounded-lg text-sm whitespace-nowrap">
          {error}
        </div>
      )}
      <div className="absolute bottom-full right-0 mb-2 text-sm text-gray-600">
        {isListening ? 'Listening...' : 'Click to start voice commands'}
      </div>
    </div>
  );
};

export default VoiceCommandButton; 