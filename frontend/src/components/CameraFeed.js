import React, { useRef, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { detectRedColor } from '../utils/detection';

const CameraFeed = ({ camera, onDelete }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [lastAlertType, setLastAlertType] = useState(null);
    const [lastAlertTime, setLastAlertTime] = useState(0);

    // ✅ FIX: Use cors-anywhere proxy to solve Mixed Content error
    const proxiedUrl = `https://cors-anywhere.herokuapp.com/${camera.url}`;

    const createAlert = useCallback(async (detectionType) => {
        const { error } = await supabase
            .from('alerts')
            .insert([{ camera_id: camera.id, detection_type: detectionType, status: 'new' }]);
        if (error) {
            console.error('Error creating alert:', error);
        } else {
            setLastAlertType(detectionType);
            setLastAlertTime(Date.now());
        }
    }, [camera.id]);

    useEffect(() => {
        const video = videoRef.current;
        video.src = proxiedUrl; // Use proxied URL for video element
        video.crossOrigin = "Anonymous";
        video.play().catch(e => console.error("Error playing hidden video for detection:", e));

        let animationFrameId;

        const processFrame = () => {
            const canvas = canvasRef.current;
            if (video.paused || video.ended || !canvas) {
                animationFrameId = requestAnimationFrame(processFrame);
                return;
            }
            
            const ctx = canvas.getContext('2d');
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

        const checkOpenCvReady = setInterval(() => {
            if (window.cv) {
                clearInterval(checkOpenCvReady);
                processFrame();
            }
        }, 100);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(checkOpenCvReady);
        };
    }, [proxiedUrl, createAlert, lastAlertType, lastAlertTime]);

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete camera "${camera.name}"?`)) {
            onDelete(camera.id);
        }
    };

    return (
        <div className="camera-feed">
            <h4>{camera.name}</h4>
            <button className="delete-camera-btn" onClick={handleDelete}>×</button>
            
            {/* Display feed using an img tag with the proxied URL */}
            <img 
                src={proxiedUrl} 
                alt={`Live feed from ${camera.name}`}
            />
            
            {/* Hidden video and canvas for detection processing */}
            <video ref={videoRef} style={{ display: 'none' }}></video>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
};

// We need to add useState for this component
import { useState } from 'react';
export default CameraFeed;