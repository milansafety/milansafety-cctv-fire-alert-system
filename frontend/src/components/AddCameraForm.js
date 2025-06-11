// frontend/src/components/AddCameraForm.js

import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AddCameraForm = ({ onCameraAdded, userId }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ✅ FIX: 'data' variable hata diya kyonki use nahi ho raha tha
        const { error } = await supabase
            .from('cameras')
            .insert([{ name, url, user_id: userId }]);
        
        if (error) {
            console.error('Error adding camera:', error);
        } else {
            setName('');
            setUrl('');
            onCameraAdded();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-camera-form">
            <input type="text" placeholder="Camera Name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="text" placeholder="Camera Stream URL" value={url} onChange={e => setUrl(e.target.value)} required />
            <button type="submit">Add Camera</button>
        </form>
    );
};

export default AddCameraForm;