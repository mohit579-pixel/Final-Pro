import store from '../Redux/store';
import { setLastCommand, setError } from '../Redux/voiceCommandSlice';

class VoiceCommandService {
  constructor() {
    this.recognition = null;
    this.isInitialized = false;

    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.setupRecognition();
      this.isInitialized = true;
    }
  }

  setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
        .toLowerCase();

      this.handleCommand(transcript);
    };

    this.recognition.onerror = (event) => {
      store.dispatch(setError(event.error));
    };
  }

  handleCommand(transcript) {
    store.dispatch(setLastCommand(transcript));

    // Navigation commands
    if (transcript.includes('go to') || transcript.includes('navigate to')) {
      const page = transcript.split('go to')[1]?.trim() || transcript.split('navigate to')[1]?.trim();
      this.handleNavigation(page);
    }

    // Button click commands
    if (transcript.includes('click') || transcript.includes('press')) {
      const buttonName = transcript.split('click')[1]?.trim() || transcript.split('press')[1]?.trim();
      this.handleButtonClick(buttonName);
    }
  }

  handleNavigation(page) {
    const routes = {
      'dashboard': '/dashboard',
      'appointments': '/appointments',
      'profile': '/profile',
      'settings': '/settings',
      'login': '/login',
      'home': '/',
      'hello': '/signup',
      'calendar': '/patient/calendar',
      'payments': '/payments',
      'medical history': '/medical-history',
      'treatment plan': '/treatment-plan',
      // Add more routes as needed
    };

    const matchedRoute = Object.entries(routes).find(([key]) => 
      page.includes(key)
    );

    if (matchedRoute) {
      window.location.href = matchedRoute[1];
    }
  }

  handleButtonClick(buttonName) {
    // Find all buttons on the page
    const buttons = Array.from(document.querySelectorAll('button, [role="button"], a'));
    
    // Try to find a button that matches the command
    const matchingButton = buttons.find(button => {
      const buttonText = button.textContent?.toLowerCase() || '';
      const buttonAriaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
      return buttonText.includes(buttonName) || buttonAriaLabel.includes(buttonName);
    });

    if (matchingButton) {
      matchingButton.click();
    }
  }

  startListening() {
    if (!this.isInitialized) {
      store.dispatch(setError('Speech recognition is not supported in this browser'));
      return;
    }

    if (this.recognition) {
      this.recognition.start();
      store.dispatch(setLastCommand(''));
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

// Create and export a single instance
const voiceCommandService = new VoiceCommandService();
export { voiceCommandService }; 