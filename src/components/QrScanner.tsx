'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

interface QRScannerProps {
  isScanning: boolean;
  onScanComplete: (data: string) => void;
  onScanError: (error: any) => void;
}

export default function QRScanner({
  isScanning,
  onScanComplete,
  onScanError,
}: QRScannerProps) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();

    if (isScanning) {
      startScanning(codeReader);
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);

  const startScanning = async (codeReader: BrowserQRCodeReader) => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      videoRef.current.srcObject = stream;

      controlsRef.current = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScan(result.getText());
          }
          if (error) {
            handleError(error);
          }
        },
      );
    } catch (error) {
      console.error('Failed to start scanning:', error);
      onScanError(error);
    }
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
      console.log('Scanner stopped.');
    } else {
      console.log('Scanner is not running or paused.');
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleScan = (decodedText: string) => {
    onScanComplete(decodedText);
  };

  const handleError = (err: any) => {
    if (err.name !== 'NotFoundException' && err.name !== 'e') {
      console.error('QR code parse error:', err);
      onScanError(err);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <video
          ref={videoRef}
          className="w-full max-w-[500px] h-auto"
          style={{ display: isScanning ? 'block' : 'none' }}
        />
      </div>
    </div>
  );
}
