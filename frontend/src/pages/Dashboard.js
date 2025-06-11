import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import CameraFeed from '../components/CameraFeed';
import AlertsList from '../components/AlertsList';
import AddCameraForm from '../components/AddCameraForm';

const Dashboard = ({ session }) => {
    const [cameras, setCameras] = useState([]);

    const fetchCameras = useCallback(async () => {
        const { data, error } = await supabase
            .from('cameras')
            .select('*')
            .eq('user_id', session.user.id);

        if (error) console.error('Error fetching cameras:', error);
        else setCameras(data || []);
    }, [session.user.id]);

    useEffect(() => {
        fetchCameras();
    }, [fetchCameras]);

    const handleDeleteCamera = async (cameraId) => {
        const { error } = await supabase
            .from('cameras')
            .delete()
            .eq('id', cameraId);

        if (error) {
            alert("Error deleting camera: " + error.message);
        } else {
            // Refresh camera list after deleting
            fetchCameras();
        }
    };
    
    const handleSignOut = async () => {
        await supabase.auth.signOut();
    }

    return (
        <div className="dashboard">
            <header>
                <h1>CCTV Monitoring Dashboard</h1>
                <button onClick={handleSignOut}>Sign Out</button>
            </header>
            <main>
                <div className="left-panel">
                    <h2>Cameras</h2>
                    <AddCameraForm onCameraAdded={fetchCameras} userId={session.user.id} />
                    <div className="camera-grid">
                        {cameras.map(camera => (
                            <CameraFeed 
                                key={camera.id} 
                                camera={camera} 
                                onDelete={handleDeleteCamera} 
                            />
                        ))}
                    </div>
                </div>
                <div className="right-panel">
                    <AlertsList />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;