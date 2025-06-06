import store from '../Redux/store';
import { setLastCommand, setError } from '../Redux/voiceCommandSlice';
import toast from 'react-hot-toast';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError {
  error: string;
  message: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

class VoiceCommandService {
  private recognition: SpeechRecognition | null = null;
  private isInitialized: boolean = false;

  constructor() {
    try {
      if ('webkitSpeechRecognition' in window) {
        this.recognition = new window.webkitSpeechRecognition();
        this.setupRecognition();
        this.isInitialized = true;
      } else {
        console.warn('Speech recognition is not supported in this browser');
      }
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      store.dispatch(setError('Failed to initialize voice commands'));
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    try {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        try {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('')
            .toLowerCase();

          this.handleCommand(transcript);
        } catch (error) {
          console.error('Error processing speech result:', error);
          store.dispatch(setError('Failed to process voice command'));
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech recognition error:', event);
        store.dispatch(setError(event.error));
        toast.error('Voice command error: ' + event.error);
      };
    } catch (error) {
      console.error('Error setting up speech recognition:', error);
      store.dispatch(setError('Failed to setup voice commands'));
    }
  }

  private handleCommand(transcript: string): void {
    store.dispatch(setLastCommand(transcript));
    console.log('Voice command received:', transcript);

    try {
      // Navigation commands
      if (transcript.includes('go to') || transcript.includes('navigate to')) {
        const page = transcript.split('go to')[1]?.trim() || transcript.split('navigate to')[1]?.trim();
        if (page) {
          this.handleNavigation(page);
        }
      }

      // Button click commands
      if (transcript.includes('click') || transcript.includes('press')) {
        const buttonName = transcript.split('click')[1]?.trim() || transcript.split('press')[1]?.trim();
        if (buttonName) {
          this.handleButtonClick(buttonName);
        }
      }
    } catch (error) {
      console.error('Error handling command:', error);
      store.dispatch(setError('Failed to execute voice command'));
      toast.error('Failed to execute voice command');
    }
  }

  private handleNavigation(page: string): void {
    console.log(page);
    
    // Get user role from Redux store or localStorage
    const userRole = localStorage.getItem('role') || 'USER';
    console.log(userRole);
    const routes: { [key: string]: { [key: string]: string } } = {
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
        'schedule': '/doctor/schedule',
        'profile': '/doctor/profile',
        'settings': '/doctor/settings',
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
        'treatment plan': '/treatment-plan'
      }
    };

    try {
      const roleRoutes = routes[userRole] || routes.user;
      const matchedRoute = Object.entries(roleRoutes).find(([key]) => 
        page.includes(key.toLowerCase())
      );

      if (matchedRoute) {
        window.location.href = matchedRoute[1];
        toast.success(`Navigating to ${matchedRoute[0]}`);
      } else {
        toast.error(`Could not find page: ${page}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate');
    }
  }

  private handleButtonClick(buttonName: string): void {
    try {
      // Find all buttons on the page
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], a'));
      
      // Try to find a button that matches the command
      const matchingButton = buttons.find(button => {
        const buttonText = button.textContent?.toLowerCase() || '';
        const buttonAriaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
        return buttonText.includes(buttonName) || buttonAriaLabel.includes(buttonName);
      });

      if (matchingButton) {
        (matchingButton as HTMLElement).click();
        toast.success(`Clicked ${buttonName}`);
      } else {
        toast.error(`Could not find button: ${buttonName}`);
      }
    } catch (error) {
      console.error('Button click error:', error);
      toast.error('Failed to click button');
    }
  }

  public startListening(): void {
    if (!this.isInitialized) {
      store.dispatch(setError('Speech recognition is not supported in this browser'));
      toast.error('Voice commands are not supported in this browser');
      return;
    }

    try {
      if (this.recognition) {
        this.recognition.start();
        store.dispatch(setLastCommand(''));
        toast.success('Listening for voice commands...');
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      store.dispatch(setError('Failed to start voice commands'));
      toast.error('Failed to start voice commands');
    }
  }

  public stopListening(): void {
    try {
      if (this.recognition) {
        this.recognition.stop();
        toast.success('Voice commands stopped');
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      store.dispatch(setError('Failed to stop voice commands'));
      toast.error('Failed to stop voice commands');
    }
  }
}

export const voiceCommandService = new VoiceCommandService(); 