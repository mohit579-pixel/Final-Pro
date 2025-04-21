// handGestureService.d.ts

declare module './handGestureService' {
  export class HandGestureService {
    model: any;
    isInitialized: boolean;
    labels: string[];
    predictionInterval: any;
    video: HTMLVideoElement | null;
    constructor();
    init(modelUrl: string): Promise<void>;
    setupWebcam(): Promise<void>;
    startGestureDetection(): void;
    detectGesture(): Promise<void>;
    handleGesture(gesture: string): void;
    clickFirstButton(): void;
    clickSubmit(): void;
    clearInputs(): void;
  }
  const _default: HandGestureService;
  export default _default;
}
