// MediaPipe Hands-based gesture detection
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

class HandGestureService {
  constructor() {
    this.isInitialized = false;
    this.labels = ['up', 'submit', 'right', 'left', 'down', 'clear'];
    this.video = null;
    this.hands = null;
    this.camera = null;
    this.lastGesture = null;
    this.buttons = [];
    this.selectedButtonIndex = 0;
  }

  async init() {
    if (this.isInitialized) return;
    await this.setupWebcam();
    this.initMediaPipe();
    this.updateButtonsList();
    this.isInitialized = true;
    // Optionally update button list on navigation (SPA)
    window.addEventListener('popstate', () => this.updateButtonsList());
    window.addEventListener('hashchange', () => this.updateButtonsList());
    // If using React Router, you may want to call updateButtonsList() on route change
  }

  async setupWebcam() {
    this.video = document.createElement('video');
    this.video.width = 640;
    this.video.height = 480;
    this.video.style.display = 'none';
    document.body.appendChild(this.video);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.video.srcObject = stream;
    await new Promise((resolve) => {
      this.video.onloadedmetadata = () => {
        this.video.play();
        resolve();
      };
    });
  }

  initMediaPipe() {
    this.hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });
    this.hands.onResults((results) => this.onResults(results));
    this.camera = new Camera(this.video, {
      onFrame: async () => {
        await this.hands.send({ image: this.video });
      },
      width: 640,
      height: 480
    });
    this.camera.start();
  }

  onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const gesture = this.classifyGesture(landmarks);
      if (gesture && gesture !== this.lastGesture) {
        this.lastGesture = gesture;
        this.handleGesture(gesture);
      }
    }
  }

  // --- Gesture-driven button navigation methods ---
  updateButtonsList() {
    // Exclude buttons inside sidebar (by data-sidebar or group/sidebar-wrapper)
    const allButtons = Array.from(document.querySelectorAll('button, [role="button"]'));
    this.buttons = allButtons.filter(btn =>
      !btn.closest('.sidebar-content') &&
      !btn.closest('[data-sidebar-content]')
    );
    if (this.buttons.length > 0) {
      // Try to set default selection to notification button
      let notificationIdx = this.buttons.findIndex(
        btn => btn.getAttribute('aria-label')?.toLowerCase().includes('notification') ||
               btn.className?.toLowerCase().includes('notification') ||
               btn.id?.toLowerCase().includes('notification')
      );
      this.selectedButtonIndex = notificationIdx !== -1 ? notificationIdx : 0;
      this.highlightSelectedButton();
    }
  }

  highlightSelectedButton() {
    this.buttons.forEach((btn, idx) => {
      btn.classList.toggle('gesture-selected', idx === this.selectedButtonIndex);
    });
  }

  moveSelection(direction) {
    if (this.buttons.length === 0) return;
    if (direction === 'right') {
      this.selectedButtonIndex = (this.selectedButtonIndex + 1) % this.buttons.length;
    } else if (direction === 'left') {
      this.selectedButtonIndex = (this.selectedButtonIndex - 1 + this.buttons.length) % this.buttons.length;
    }
    this.highlightSelectedButton();
  }

  clickSelectedButton() {
    if (this.buttons.length > 0) {
      this.buttons[this.selectedButtonIndex].click();
    }
  }

  clearSelection() {
    this.buttons.forEach(btn => btn.classList.remove('gesture-selected'));
    this.selectedButtonIndex = 0;
  }

  // Simple gesture classification based on hand position
  classifyGesture(landmarks) {
    // Use wrist (0), index_tip (8), middle_tip (12), ring_tip (16), pinky_tip (20)
    const wrist = landmarks[0];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    // Basic direction: up/down/left/right
    if (indexTip.y < wrist.y - 0.1) return 'up';
    if (indexTip.y > wrist.y + 0.2) return 'down';
    if (indexTip.x < wrist.x - 0.1) return 'left';
    if (indexTip.x > wrist.x + 0.1) return 'right';
    // Five fingers extended for 'submit' (relaxed thresholds)
    const thumbTip = landmarks[4];
    // const indexTip = landmarks[8];
    // const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    // V sign (peace sign) for 'submit': index and middle up, others down
    console.log('wrist.y', wrist.y, 'thumbTip.y', thumbTip.y, 'indexTip.y', indexTip.y, 'middleTip.y', middleTip.y, 'ringTip.y', ringTip.y, 'pinkyTip.y', pinkyTip.y);
    const indexUp = indexTip.y < wrist.y - 0.07;
    const middleUp = middleTip.y < wrist.y - 0.07;
    const thumbDown = thumbTip.y > wrist.y + 0.02;
    const ringDown = ringTip.y > wrist.y + 0.02;
    const pinkyDown = pinkyTip.y > wrist.y + 0.02;
    if (indexUp || middleUp || thumbDown || ringDown || pinkyDown) return 'submit';
    // Spread fingers for 'clear' (index, middle, ring, pinky far apart)
    if ((Math.abs(indexTip.x - pinkyTip.x) > 0.3) && (Math.abs(middleTip.x - ringTip.x) > 0.1)) return 'clear';
    return null;
  }

  handleGesture(gesture) {
    console.log('Detected gesture:', gesture);
    switch (gesture) {
      case 'right':
        this.moveSelection('right');
        break;
      case 'left':
        this.moveSelection('left');
        break;
      // case 'up':
      case 'submit':
        this.clickSelectedButton();
        break;
      case 'clear':
        this.clearSelection();
        break;
      default:
        break;
    }
  }

  clickFirstButton() {
    const btn = document.querySelector('button, [role="button"]');
    if (btn) btn.click();
  }

  clickSubmit() {
    const btn = document.querySelector('button[type="submit"], [type="submit"]');
    if (btn) btn.click();
  }

  clearInputs() {
    document.querySelectorAll('input, textarea').forEach(el => {
      if (el.type === 'text' || el.tagName === 'TEXTAREA') el.value = '';
    });
  }
}

export default new HandGestureService();
