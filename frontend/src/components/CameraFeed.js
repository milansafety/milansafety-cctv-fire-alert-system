// frontend/src/components/CameraFeed.js

// ✅ FIX: Humne yahan se 'useRef' aur 'useEffect' ko hata diya hai, kyonki unka istemal nahi ho raha.
import React from 'react';

const CameraFeed = ({ camera }) => {
    const streamUrl = camera.url;

    return (
        <div className="camera-feed">
            <h4>{camera.name}</h4>
            
            <img 
                src={streamUrl} 
                alt={`Live feed from ${camera.name}`}
                style={{ width: '100%', border: '1px solid black' }}
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
            />
            <div style={{ display: 'none', color: 'red' }}>
                Video feed load nahi ho paayi. URL check karein aur ensure karein ki aapka phone aur computer ek hi WiFi par hain.
            </div>
        </div>
    );
};

export default CameraFeed;