// frontend/src/components/CameraFeed.js

import React, { useRef, useEffect } from 'react';
// Hum abhi ke liye detection logic aur Supabase ko is file se hata rahe hain,
// taaki pehle video feed par focus kar sakein.

const CameraFeed = ({ camera }) => {
    // Ab humein inki zaroorat nahi hai:
    // const videoRef = useRef(null);
    // const canvasRef = useRef(null);

    // Humne cors-anywhere proxy hata diya hai, kyonki <img> tag ko iski zaroorat kam padti hai.
    // Agar mixed content error aaye to waapas laga sakte hain.
    const streamUrl = camera.url;

    // Detection logic abhi ke liye disabled hai.
    /*
    useEffect(() => {
        // ... (Poora detection logic abhi ke liye comment out hai)
    }, [camera.url, camera.id]);
    */

    return (
        <div className="camera-feed">
            <h4>{camera.name}</h4>
            
            {/* ✅ SOLUTION: Hum <video> aur <canvas> ke bajaye ek simple <img> tag use kar rahe hain. */}
            {/* <img> tag MJPEG streams ko direct chala sakta hai. */}
            <img 
                src={streamUrl} 
                alt={`Live feed from ${camera.name}`}
                style={{ width: '100%', border: '1px solid black' }}
                // Agar image load na ho to error dikhane ke liye
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
            />
            <div style={{ display: 'none', color: 'red' }}>
                Video feed load nahi ho paayi. URL check karein aur ensure karein ki aapka phone aur computer ek hi WiFi par hain.
            </div>
        </div>
    );
};

export default CameraFeed;