import Tesseract from 'tesseract.js';
import { Html5Qrcode } from 'html5-qrcode';

// VIN validation - 17 characters, alphanumeric (no I, O, Q)
const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

class CameraService {
  constructor() {
    this.html5QrCode = null;
    this.isProcessing = false;
    this.lastProcessedFrame = null;
    this.frameCount = 0;
    this.processEveryNthFrame = 5; // Process every 5th frame to reduce CPU load
  }

  async initializeCamera(elementId) {
    try {
      // Check if element exists
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Camera container element with id '${elementId}' not found`);
      }

      console.log('Initializing camera for element:', elementId);

      if (!this.html5QrCode) {
        this.html5QrCode = new Html5Qrcode(elementId);
      }

      const config = {
        fps: 15,
        qrbox: { width: 400, height: 160 },
      };

      // Start camera with proper callbacks
      console.log('Starting camera with config:', config);

      await this.html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          // QR code detected - we'll handle this separately
          console.log('QR detected:', decodedText);
        },
        (errorMessage) => {
          // Error message - can be ignored for continuous scanning
          console.debug('QR detection message:', errorMessage);
        }
      );

      console.log('Camera started successfully');
      return true;
    } catch (err) {
      console.error('Failed to initialize camera:', err);
      console.error('Error details:', err.name, err.message, err);
      const errorMessage = err?.message || err?.toString() || 'Unknown error';
      throw new Error(
        errorMessage.includes('NotAllowedError')
          ? 'Camera access denied. Please enable camera permissions.'
          : errorMessage.includes('not found')
          ? errorMessage
          : 'Failed to access camera. Please check your device.'
      );
    }
  }

  async stopCamera() {
    try {
      if (this.html5QrCode) {
        // First, stop the scanning
        await this.html5QrCode.stop();
        // Then clear the HTML
        await this.html5QrCode.clear();
        this.html5QrCode = null;
      }
      this.isProcessing = false;
      this.frameCount = 0;
    } catch (err) {
      console.error('Error stopping camera:', err);
      // Force cleanup even if stop fails
      this.html5QrCode = null;
      this.isProcessing = false;
      this.frameCount = 0;
    }
  }

  async captureAndProcessFrame() {
    if (this.isProcessing || !this.html5QrCode) {
      return null;
    }

    // Only process every Nth frame to reduce CPU load
    this.frameCount++;
    if (this.frameCount % this.processEveryNthFrame !== 0) {
      return null;
    }

    try {
      this.isProcessing = true;

      // Get the video element from the container
      const container = document.getElementById('camera-container');
      if (!container) {
        console.warn('Camera container not found');
        return null;
      }

      const video = container.querySelector('video');
      if (!video) {
        console.warn('Video element not found in container');
        return null;
      }

      if (!video.srcObject) {
        console.warn('Video srcObject not set - camera may not have started');
        return null;
      }

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        // Video not ready yet
        return null;
      }

      // Create a canvas and draw the current video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return null;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Run OCR on the canvas
      const result = await Tesseract.recognize(canvas, 'eng', {
        logger: () => {}, // Suppress logger output
      });

      const text = result.data.text.toUpperCase().replace(/\s+/g, '');

      if (text && text.length > 0) {
        console.log('OCR detected text:', text);
      }

      // Extract potential VINs from the text
      const extractedVIN = this.extractVINFromText(text);

      if (extractedVIN) {
        console.log('VIN extracted:', extractedVIN);
        return {
          vin: extractedVIN,
          rawText: result.data.text,
          confidence: result.data.confidence,
        };
      }

      return null;
    } catch (err) {
      console.error('OCR processing error:', err);
      return null;
    } finally {
      this.isProcessing = false;
    }
  }

  extractVINFromText(text) {
    // Look for a 17-character sequence that matches VIN pattern
    const vinMatch = text.match(/[A-HJ-NPR-Z0-9]{17}/i);

    if (vinMatch) {
      const potentialVIN = vinMatch[0].toUpperCase();
      if (VIN_PATTERN.test(potentialVIN)) {
        return potentialVIN;
      }
    }

    // If exact match not found, look for fuzzy matches of 16-18 chars
    // and attempt cleanup
    const fuzzyMatch = text.match(/[A-HJ-NPR-Z0-9]{16,18}/i);
    if (fuzzyMatch) {
      let candidate = fuzzyMatch[0].toUpperCase();

      // Try to clean up common OCR mistakes
      candidate = candidate.replace(/O/g, '0'); // O to 0
      candidate = candidate.replace(/I/g, '1'); // I to 1
      candidate = candidate.slice(0, 17); // Trim to 17 chars

      if (VIN_PATTERN.test(candidate)) {
        return candidate;
      }
    }

    return null;
  }

  validateVIN(vin) {
    return VIN_PATTERN.test(vin);
  }

  getVideoElement() {
    return this.html5QrCode?.getVideoElement() || null;
  }
}

export const cameraService = new CameraService();
