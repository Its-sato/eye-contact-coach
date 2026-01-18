import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to handle WebRTC camera access.
 * @returns {Object} videoRef, stream, error, isLoading
 */
export function useCamera() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function setupCamera() {
      try {
        setIsLoading(true);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            frameRate: { ideal: 30 }
          },
          audio: false
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          // Wait for video to be ready
          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              resolve();
            };
          });
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    setupCamera();

    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return { videoRef, stream, error, isLoading };
}
