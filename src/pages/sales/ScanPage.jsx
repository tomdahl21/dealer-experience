import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useVehicleStore } from '../../store/vehicleStore';
import { cameraService } from '../../services/cameraService';
import { vinDecoderService } from '../../services/vinDecoderService';

const SAMPLE_VINS = [
  { vin: '1G1YY26E965105305', label: '2023 Chevrolet Tahoe' },
  { vin: '3GNAXKEV0PL123456', label: '2023 Chevrolet Silverado' },
];

export default function ScanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useVehicleStore();
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [detectedVIN, setDetectedVIN] = useState('');
  const [detectionInProgress, setDetectionInProgress] = useState(false);
  const [noVINDetected, setNoVINDetected] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const processingIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const cleanupInProgressRef = useRef(false);

  // Determine the correct path based on current location
  const getVehiclePath = (vin) => {
    if (location.pathname.startsWith('/manager')) {
      return `/manager/vehicle/${vin}`;
    }
    return `/associate/vehicle/${vin}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!vin.trim()) {
      setLocalError('Please enter a VIN');
      return;
    }

    if (vin.length !== 17) {
      setLocalError('VIN must be 17 characters');
      return;
    }

    setLoading(true);
    try {
      // Decode VIN using NHTSA API
      const decodedVehicle = await vinDecoderService.decodeVin(vin);
      setVehicleDetails(decodedVehicle);
      
      // Navigate to vehicle detail page with decoded VIN data
      navigate(getVehiclePath(vin), { state: { vehicleDetails: decodedVehicle } });
    } catch (err) {
      setLocalError(err.message || 'Error decoding VIN');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleVINClick = async (sampleVin) => {
    setVin(sampleVin);
    setLoading(true);
    setLocalError('');
    setVehicleDetails(null);
    try {
      // Decode VIN using NHTSA API
      const decodedVehicle = await vinDecoderService.decodeVin(sampleVin);
      setVehicleDetails(decodedVehicle);
      
      // Navigate to vehicle detail page with decoded VIN data
      navigate(getVehiclePath(sampleVin), { state: { vehicleDetails: decodedVehicle } });
    } catch (err) {
      setLocalError(err.message || 'Error decoding VIN');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableCamera = async () => {
    if (cleanupInProgressRef.current) {
      return; // Prevent action while cleanup is in progress
    }

    setCameraError('');
    setDetectedVIN('');
    setDetectedText('');
    setConfidence(0);
    setNoVINDetected(false);
    setCameraActive(true);
    setDetectionInProgress(true);

    // Set 5-second timeout for no VIN detection
    timeoutRef.current = setTimeout(() => {
      setNoVINDetected(true);
      setDetectionInProgress(false);
    }, 5000);

    // Wait for the DOM to render the camera container before initializing
    setTimeout(async () => {
      try {
        await cameraService.initializeCamera('camera-container');

        // Start processing frames for VIN detection
        processingIntervalRef.current = setInterval(async () => {
          const result = await cameraService.captureAndProcessFrame();
          if (result) {
            // Update detected text and confidence for visual feedback
            console.log('Frame result:', result);
            setDetectedText(result.rawText?.substring(0, 50) || '');
            setConfidence(result.confidence || 0);
            console.log('Updated state - text:', result.rawText?.substring(0, 50), 'confidence:', result.confidence);

            // If full VIN detected, stop and show result
            if (result.vin) {
              console.log('VIN found:', result.vin);
              // Clear timeout since VIN was detected
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              setVin(result.vin); // Set the main VIN field
              setDetectedVIN(result.vin);
              setNoVINDetected(false);
              setDetectionInProgress(false);
              if (processingIntervalRef.current) {
                clearInterval(processingIntervalRef.current);
                processingIntervalRef.current = null;
              }

              // Stop camera so user can review/edit VIN before lookup
              await handleDisableCamera();
            }
          }
        }, 200); // Check every 200ms
      } catch (err) {
        setCameraError(err.message);
        setCameraActive(false);
        setDetectionInProgress(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    }, 100); // Wait 100ms for React to render the element
  };

  const handleDisableCamera = async () => {
    if (cleanupInProgressRef.current) {
      return; // Prevent multiple cleanup attempts
    }
    cleanupInProgressRef.current = true;

    try {
      // Stop all intervals and timeouts FIRST
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Stop camera and wait for cleanup to complete
      await cameraService.stopCamera();

      // Now it's safe to update state
      setCameraActive(false);
      setDetectionInProgress(false);
      setNoVINDetected(false);
    } finally {
      cleanupInProgressRef.current = false;
    }
  };

  const handleTryAgain = async () => {
    if (cleanupInProgressRef.current) {
      return; // Prevent action while cleanup is in progress
    }
    cleanupInProgressRef.current = true;

    try {
      // Stop all intervals and timeouts FIRST
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Stop camera and wait for cleanup to complete
      await cameraService.stopCamera();

      // Now reset state safely
      setNoVINDetected(false);
      setDetectedVIN('');
      setDetectedText('');
      setConfidence(0);
      setDetectionInProgress(true);

      // Set new 5-second timeout
      timeoutRef.current = setTimeout(() => {
        setNoVINDetected(true);
        setDetectionInProgress(false);
      }, 5000);

      // Reinitialize camera after state updates
      setTimeout(async () => {
        try {
          await cameraService.initializeCamera('camera-container');

          // Start processing frames for VIN detection
          processingIntervalRef.current = setInterval(async () => {
            const result = await cameraService.captureAndProcessFrame();
            if (result) {
              console.log('Frame result:', result);
              setDetectedText(result.rawText?.substring(0, 50) || '');
              setConfidence(result.confidence || 0);

              if (result.vin) {
                console.log('VIN found:', result.vin);
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
                setVin(result.vin); // Set the main VIN field
                setDetectedVIN(result.vin);
                setNoVINDetected(false);
                setDetectionInProgress(false);
                if (processingIntervalRef.current) {
                  clearInterval(processingIntervalRef.current);
                  processingIntervalRef.current = null;
                }

                // Stop camera so user can review/edit VIN before lookup
                await handleDisableCamera();
              }
            }
          }, 200);
        } catch (err) {
          setCameraError(err.message);
          setCameraActive(false);
          setDetectionInProgress(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        } finally {
          cleanupInProgressRef.current = false;
        }
      }, 100);
    } catch (err) {
      console.error('Error during try again:', err);
      cleanupInProgressRef.current = false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleDisableCamera();
    };
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h2" gutterBottom>
        Scan VIN
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter the vehicle VIN or select from sample inventory
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Vehicle Lookup
          </Typography>

          {(localError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError || error}
            </Alert>
          )}

          {cameraError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {cameraError}
            </Alert>
          )}

          {/* Vehicle Details Display */}
          {vehicleDetails && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ✓ Vehicle Information Decoded:
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{vehicleDetails.year}</strong> {vehicleDetails.make} {vehicleDetails.model}
                </Typography>
                {vehicleDetails.bodyClass && (
                  <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Body: {vehicleDetails.bodyClass}
                  </Typography>
                )}
                {vehicleDetails.engineType && (
                  <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Engine: {vehicleDetails.engineType}
                  </Typography>
                )}
                {vehicleDetails.transmission && (
                  <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                    Transmission: {vehicleDetails.transmission}
                  </Typography>
                )}
              </Box>
            </Alert>
          )}

          {/* Camera Container - Always in DOM but visually hidden when not active */}
          {cameraActive && (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  mb: 2,
                  bgcolor: '#000',
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  width: '100%',
                  minHeight: 250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box id="camera-container" sx={{ width: '100%', height: '100%' }} />

                {/* Scanning Overlay - Show during active scanning */}
                {detectionInProgress && !detectedVIN && (
                  <>
                    {/* Pulsing scanning frame */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 400,
                        height: 160,
                        border: '3px solid',
                        borderColor: 'primary.main',
                        borderRadius: 1,
                        zIndex: 5,
                        animation: 'pulse 1.5s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 0.5, boxShadow: '0 0 20px rgba(25, 118, 210, 0.5)' },
                          '50%': { opacity: 1, boxShadow: '0 0 40px rgba(25, 118, 210, 0.8)' },
                        },
                      }}
                    />

                    {/* Status overlay */}
                    <Stack
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        right: 20,
                        zIndex: 10,
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                          Scanning for VIN...
                        </Typography>
                      </Stack>

                      {detectedText && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'grey.400', display: 'block' }}>
                            Detected Text:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'primary.light',
                              fontFamily: 'monospace',
                              wordBreak: 'break-all',
                            }}
                          >
                            {detectedText}
                          </Typography>
                          {confidence > 0 && (
                            <Typography variant="caption" sx={{ color: 'grey.400', mt: 0.5, display: 'block' }}>
                              Confidence: {Math.round(confidence)}%
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Stack>
                  </>
                )}

                {/* VIN Detected Overlay */}
                {detectedVIN && !noVINDetected && (
                  <Stack
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 20,
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                      p: 3,
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'success.main', mb: 2 }}>
                      ✓ VIN Detected
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                      }}
                    >
                      {detectedVIN}
                    </Typography>
                  </Stack>
                )}

                {/* No VIN Detected Overlay */}
                {noVINDetected && (
                  <Stack
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 20,
                      bgcolor: 'rgba(0, 0, 0, 0.8)',
                      p: 3,
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'warning.main', mb: 2 }}>
                      No VIN Detected
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.300', mb: 3 }}>
                      Could not find a valid VIN in the camera view. Try adjusting the angle or lighting.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleTryAgain}
                      >
                        Try Again
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleDisableCamera}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </Box>
            </Box>
          )}

          {/* Unified VIN Input Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              Enter VIN or scan with camera:
            </Typography>

            <Stack spacing={2}>
              {/* VIN Input Field */}
              <TextField
                label="VIN Number"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                placeholder="1G1YY26E965105305"
                required
                disabled={loading || cameraActive}
                fullWidth
                inputProps={{ maxLength: 17 }}
              />

              {/* Lookup Button */}
              <Button
                type="button"
                variant="contained"
                size="large"
                disabled={loading || !vin.trim()}
                fullWidth
                onClick={() => handleSubmit({ preventDefault: () => {} })}
              >
                {loading ? <CircularProgress size={24} /> : 'Lookup Vehicle'}
              </Button>

              {/* Camera Controls */}
              {!cameraActive ? (
                <Button
                  variant="outlined"
                  onClick={handleEnableCamera}
                  disabled={loading}
                  fullWidth
                >
                  Scan with Camera
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDisableCamera}
                  fullWidth
                >
                  Disable Camera
                </Button>
              )}
            </Stack>
          </Box>

          {/* Sample VINs */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              <strong>Sample VINs:</strong>
            </Typography>
            {SAMPLE_VINS.map((sample) => (
              <Button
                key={sample.vin}
                variant="text"
                size="small"
                fullWidth
                onClick={() => handleSampleVINClick(sample.vin)}
                disabled={loading}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  textTransform: 'none',
                }}
              >
                <Typography variant="caption">
                  {sample.label} ({sample.vin})
                </Typography>
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
