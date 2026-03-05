import React, { useEffect, useRef, useState } from 'react';
import { X, Video, Mic, MicOff, VideoOff, PhoneOff, AlertCircle } from 'lucide-react';

/**
 * VideoConsultRoom
 * Uses Jitsi Meet's IFrame API (loaded dynamically from meet.jit.si CDN)
 * - roomName: unique string for the meeting room  
 * - displayName: participant's display name
 * - onClose: callback when the user hangs up / closes
 */
const VideoConsultRoom = ({ roomName, displayName, onClose }) => {
  const jitsiContainer = useRef(null);
  const jitsiApi = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadJitsi = () => {
      if (window.JitsiMeetExternalAPI) {
        initJitsi();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => { if (isMounted) initJitsi(); };
      script.onerror = () => { if (isMounted) setError('Failed to load video conferencing SDK.'); };
      document.head.appendChild(script);
    };

    const initJitsi = () => {
      if (!jitsiContainer.current) return;

      try {
        jitsiApi.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
          roomName: roomName,
          parentNode: jitsiContainer.current,
          width: '100%',
          height: '100%',
          userInfo: { displayName },
          configOverwrite: {
            prejoinPageEnabled: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            toolbarButtons: [
              'microphone', 'camera', 'closedcaptions', 'desktop',
              'fullscreen', 'fodeviceselection', 'hangup', 'chat', 'settings',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats'
            ],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            APP_NAME: 'MindEezy Consult',
            DEFAULT_BACKGROUND: '#0f0f23',
            DEFAULT_LOCAL_DISPLAY_NAME: displayName,
            TOOLBAR_ALWAYS_VISIBLE: false,
          }
        });

        jitsiApi.current.addEventListener('videoConferenceJoined', () => {
          if (isMounted) setLoading(false);
        });

        jitsiApi.current.addEventListener('readyToClose', () => {
          if (isMounted) onClose?.();
        });

        jitsiApi.current.addEventListener('errorOccurred', (err) => {
          console.error('Jitsi error:', err);
          if (isMounted) setLoading(false);
        });

        // Timeout fallback
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, 4000);

      } catch (err) {
        if (isMounted) {
          setError('Could not initialize video room.');
          setLoading(false);
        }
      }
    };

    loadJitsi();

    return () => {
      isMounted = false;
      if (jitsiApi.current) {
        jitsiApi.current.dispose();
        jitsiApi.current = null;
      }
    };
  }, [roomName, displayName]);

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50"></div>
          <h2 className="text-white font-black text-lg tracking-tight">MindEezy Live Consult</h2>
          <span className="px-3 py-1 bg-emerald-900/60 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-800">
            {roomName}
          </span>
        </div>
        <button
          onClick={() => {
            if (jitsiApi.current) jitsiApi.current.executeCommand('hangup');
            onClose?.();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg"
        >
          <PhoneOff className="h-4 w-4" />
          End Session
        </button>
      </div>

      {/* Jitsi frame */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
            <div className="h-16 w-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mb-6"></div>
            <p className="text-white font-black text-xl mb-2">Connecting to Session...</p>
            <p className="text-slate-400 text-sm font-medium">Setting up your secure, private therapy room</p>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
            <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
            <p className="text-white font-black text-xl mb-2">Connection Failed</p>
            <p className="text-slate-400 text-sm mb-6">{error}</p>
            <button onClick={onClose} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all">
              Close
            </button>
          </div>
        ) : (
          <div ref={jitsiContainer} className="w-full h-full" style={{ minHeight: '500px' }} />
        )}
      </div>
    </div>
  );
};

export default VideoConsultRoom;
