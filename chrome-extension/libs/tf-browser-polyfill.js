// Polyfill for tf.browser.fromPixels when using modular TF.js
// This provides the missing browser API that Teachable Machine needs

(function() {
  'use strict';
  
  // Wait for tf to be available
  function initPolyfill() {
    if (typeof tf === 'undefined') {
      setTimeout(initPolyfill, 50);
      return;
    }
    
    // Create browser namespace if it doesn't exist
    if (!tf.browser) {
      tf.browser = {};
    }
    
    // Implement fromPixels
    if (!tf.browser.fromPixels) {
      tf.browser.fromPixels = function(pixels, numChannels) {
        return tf.tidy(() => {
          // Get image data from canvas or video element
          let imageData;
          
          if (pixels instanceof HTMLCanvasElement) {
            const ctx = pixels.getContext('2d');
            imageData = ctx.getImageData(0, 0, pixels.width, pixels.height);
          } else if (pixels instanceof HTMLVideoElement) {
            const canvas = document.createElement('canvas');
            canvas.width = pixels.videoWidth || pixels.width;
            canvas.height = pixels.videoHeight || pixels.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(pixels, 0, 0);
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          } else if (pixels instanceof ImageData) {
            imageData = pixels;
          } else {
            throw new Error('Unsupported pixel source');
          }
          
          const { width, height, data } = imageData;
          const numChannelsToUse = numChannels || 3;
          
          // Create tensor from image data
          const values = new Int32Array(width * height * numChannelsToUse);
          
          for (let i = 0; i < height * width; i++) {
            for (let c = 0; c < numChannelsToUse; c++) {
              values[i * numChannelsToUse + c] = data[i * 4 + c];
            }
          }
          
          return tf.tensor3d(values, [height, width, numChannelsToUse], 'int32');
        });
      };
      
      console.log('tf.browser.fromPixels polyfill loaded successfully');
    }
  }
  
  initPolyfill();
})();
