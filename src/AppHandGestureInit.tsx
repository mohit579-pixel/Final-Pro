import React, { useEffect, useState } from 'react';
import handGestureService from './services/handGestureService';

export default function AppHandGestureInit() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) {
      handGestureService.init('/models/dental_model/model.json');
    } else {
      if (handGestureService.camera) {
        handGestureService.camera.stop();
      }
      if (handGestureService.video && handGestureService.video.srcObject) {
        const tracks = handGestureService.video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        handGestureService.video.remove();
        handGestureService.video = null;
      }
      handGestureService.isInitialized = false;
    }
  }, [enabled]);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
      <button
        onClick={() => setEnabled(e => !e)}
        style={{
          padding: '10px 18px',
          background: enabled ? '#2563eb' : '#e5e7eb',
          color: enabled ? '#fff' : '#222',
          border: 'none',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        aria-pressed={enabled}
      >
        {enabled ? 'Disable Gesture Control' : 'Enable Gesture Control'}
      </button>
      <div style={{ marginTop: 8, textAlign: 'center', color: enabled ? '#2563eb' : '#888', fontWeight: 500 }}>
        Gesture Control: {enabled ? 'ON' : 'OFF'}
      </div>
    </div>
  );
}
