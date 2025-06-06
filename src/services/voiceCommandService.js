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
    // Get user role from localStorage
    const userRole = localStorage.getItem('role') || 'USER';
    console.log('Current user role:', userRole);

    const routes = {
      ADMIN: {
        'dashboard': '/admin/dashboard',
        'users': '/admin/users',
        'doctors': '/admin/doctors',
        'appointments': '/admin/appointments',
        'settings': '/admin/settings',
        'profile': '/admin/profile',
        'reports': '/admin/reports',
        'home': '/admin/dashboard'
      },
      DOCTOR: {
        'dashboard': '/doctor/dashboard',
        'appointments': '/doctor/appointments',
        'patients': '/doctor/patients',
        'schedule': '/appointments/today',
        'profile': '/doctor/profile',
        'analysis': '/doctor/dental-analysis',
        'medical records': '/doctor/medical-records',
        'home': '/doctor/dashboard'
      },
      USER: {
        'dashboard': '/dashboard',
        'appointments': '/appointments',
        'profile': '/profile',
        'settings': '/settings',
        'login': '/login',
        'signup': '/signup',
        'home': '/',
        'calendar': '/patient/calendar',
        'medical history': '/medical-history',
        'treatment plan': '/treatment-plan',
        'payments': '/payments'
      }
    };

    try {
      const roleRoutes = routes[userRole] || routes.USER;
      const matchedRoute = Object.entries(roleRoutes).find(([key]) => 
        page.includes(key.toLowerCase())
      );

      if (matchedRoute) {
        window.location.href = matchedRoute[1];
        console.log(`Navigating to ${matchedRoute[0]}`);
      } else {
        console.log(`Could not find page: ${page}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
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