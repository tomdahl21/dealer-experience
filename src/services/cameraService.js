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

      const cropCanvas = this.buildVinCropCanvas(video);
      const enhancedCanvas = this.enhanceCanvasForOCR(cropCanvas);

      // Run OCR on the enhanced crop with VIN-focused settings
      const result = await Tesseract.recognize(enhancedCanvas, 'eng', {
        logger: () => {},
        tessedit_pageseg_mode: '7',
        tessedit_char_whitelist: 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789',
      });

      const rawText = result.data.text || '';
      const text = rawText.toUpperCase();

      if (text && text.length > 0) {
        console.log('OCR detected text:', text);
      }

      // Extract potential VINs from the text
      const extractedVIN = this.extractVINFromText(text);

      if (extractedVIN) {
        console.log('VIN extracted:', extractedVIN);
      }

      return {
        vin: extractedVIN,
        rawText,
        confidence: result.data.confidence,
      };
    } catch (err) {
      console.error('OCR processing error:', err);
      return null;
    } finally {
      this.isProcessing = false;
    }
  }

  extractVINFromText(text) {
    const cleanedText = (text || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    if (cleanedText.length < 17) {
      return null;
    }

    const normalizedText = cleanedText
      .replace(/O/g, '0')
      .replace(/Q/g, '0')
      .replace(/I/g, '1');

    for (let index = 0; index <= normalizedText.length - 17; index += 1) {
      const candidate = normalizedText.slice(index, index + 17);
      if (VIN_PATTERN.test(candidate)) {
        return candidate;
      }
    }

    return null;
  }

  buildVinCropCanvas(video) {
    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;

    const cropWidth = Math.floor(sourceWidth * 0.9);
    const cropHeight = Math.floor(sourceHeight * 0.35);
    const cropX = Math.floor((sourceWidth - cropWidth) / 2);
    const cropY = Math.floor((sourceHeight - cropHeight) / 2);

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;

    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) {
      return cropCanvas;
    }

    cropCtx.drawImage(
      video,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    return cropCanvas;
  }

  enhanceCanvasForOCR(inputCanvas) {
    const scale = 2;
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = inputCanvas.width * scale;
    outputCanvas.height = inputCanvas.height * scale;

    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) {
      return inputCanvas;
    }

    outputCtx.drawImage(inputCanvas, 0, 0, outputCanvas.width, outputCanvas.height);

    const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const pixels = imageData.data;

    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];

      let grayscale = red * 0.299 + green * 0.587 + blue * 0.114;
      grayscale = grayscale > 145 ? 255 : 0;

      pixels[index] = grayscale;
      pixels[index + 1] = grayscale;
      pixels[index + 2] = grayscale;
    }

    outputCtx.putImageData(imageData, 0, 0);
    return outputCanvas;
  }

  validateVIN(vin) {
    return VIN_PATTERN.test(vin);
  }

  getVideoElement() {
    return this.html5QrCode?.getVideoElement() || null;
  }
}

export const cameraService = new CameraService();
