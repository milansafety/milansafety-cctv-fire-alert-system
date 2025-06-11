// frontend/src/components/CameraFeed.js

import React, { useRef, useEffect, useState, useCallback } from 'react'; // <-- useCallback import kiya
import { supabase } from '../services/supabaseClient';
import { detectRedColor } from '../utils/detection';

const CameraFeed = ({ camera }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isDetecting, setIsDetecting] = useState(true);
    const [lastAlertType, setLastAlertType] = useState(null);
    const [lastAlertTime, setLastAlertTime] = useState(0);

    // ✅ FIX: createAlert ko useCallback me wrap kiya taaki yeh stable rahe
    const createAlert = useCallback(async (detectionType) => {
        // 'data' ko hata diya kyonki use nahi ho raha tha
        const { error } = await supabase
            .from('alerts')
            .insert([{ camera_id: camera.id, detection_type: detectionType, status: 'new' }]);
        
        if (error) {
            console.error('Error creating alert:', error);
        } else {
            console.log('Alert created for type:', detectionType);
            // Temporarily stop detection for this type to avoid spam
            setLastAlertType(detectionType);
            setLastAlertTime(Date.now());
            setTimeout(() => setLastAlertType(null), 30000); // Resume detection after 30s
        }
    }, [camera.id]); // Dependency add ki

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const videoUrl = `https://cors-anywhere.herokuapp.com/${camera.url}`;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            video.src = videoUrl;
            video.crossOrigin = "Anonymous";
            video.play().catch(e => console.error("Error playing video:", e));
        }

        let animationFrameId;

        const processFrame = () => {
            if (video.paused || video.ended || !isDetecting) {
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const now = Date.now();
            
            if (lastAlertType !== 'red_color' || now - lastAlertTime > 30000) {
                if (detectRedColor(ctx, canvas, video)) {
                    createAlert('red_color');
                }
            }

            animationFrameId = requestAnimationFrame(processFrame);
        };
        
        const startProcessing = () => {
             const checkOpenCv = setInterval(() => {
                if (window.cv) {
                    clearInterval(checkOpenCv);
                    processFrame();
                }
            }, 100);
        }
        
        video.addEventListener('loadeddata', startProcessing);

        return () => {
            video.removeEventListener('loadeddata', startProcessing);
            cancelAnimationFrame(animationFrameId);
            setIsDetecting(false);
        };
    // ✅ FIX: useEffect ki dependency array ko update kiya
    }, [camera.url, camera.id, createAlert, isDetecting, lastAlertTime, lastAlertType]);


    return (
        <div className="camera-feed">
            <h4>{camera.name}</h4>
            <video ref={videoRef} style={{ display: 'none' }}></video>
            <canvas ref={canvasRef} style={{ width: '100%', border: '1px solid black' }} />
        </div>
    );
};

export default CameraFeed;