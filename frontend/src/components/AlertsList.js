// frontend/src/components/AlertsList.js

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';

const AlertsList = () => {
    const [alerts, setAlerts] = useState([]);
    const alarmSound = useRef(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            const { data, error } = await supabase
                .from('alerts')
                .select('*, cameras(name)')
                .order('created_at', { ascending: false });
            if (error) console.error('Error fetching alerts:', error);
            else setAlerts(data);
        };

        fetchAlerts();

        const subscription = supabase
            .channel('public:alerts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, (payload) => {
                const fetchNewAlertDetails = async () => {
                    // ✅ FIX: 'error' variable hata diya kyonki use nahi ho raha tha
                    const { data } = await supabase
                        .from('alerts')
                        .select('*, cameras(name)')
                        .eq('id', payload.new.id)
                        .single();
                    if(data) {
                        setAlerts(prevAlerts => [data, ...prevAlerts]);
                        if (data.detection_type === 'red_color') {
                            playAlarm();
                        }
                    }
                }
                fetchNewAlertDetails();

            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const playAlarm = () => {
        if (alarmSound.current) {
            alarmSound.current.play().catch(e => console.log("Audio play failed, user interaction might be needed.", e));
        }
    }

    const handleAlertAction = async (alertId, newStatus) => {
        const { error } = await supabase
            .from('alerts')
            .update({ status: newStatus })
            .eq('id', alertId);

        if (error) {
            console.error('Error updating alert:', error);
        } else {
            setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
            const alert = alerts.find(a => a.id === alertId);
            if (alert.detection_type === 'smoking_person' && newStatus === 'confirmed') {
                playAlarm();
            }
        }
    };

    return (
        <div className="alerts-list">
            <h2>Alerts</h2>
            <audio ref={alarmSound} src="/alarm.mp3" preload="auto"></audio>
            <ul>
                {alerts.map(alert => (
                    <li key={alert.id} className={`alert-item status-${alert.status}`}>
                        <strong>{alert.detection_type.replace('_', ' ').toUpperCase()} Detected!</strong>
                        <p>Camera: {alert.cameras ? alert.cameras.name : 'Loading...'}</p>
                        <p>Time: {new Date(alert.created_at).toLocaleString()}</p>
                        <p>Status: {alert.status}</p>
                        
                        {alert.status === 'new' && alert.detection_type === 'smoking_person' && (
                            <div className="alert-actions">
                                <p>Activate alarm for this smoking alert?</p>
                                <button onClick={() => handleAlertAction(alert.id, 'confirmed')}>Confirm & Activate Alarm</button>
                                <button onClick={() => handleAlertAction(alert.id, 'ignored')}>Ignore</button>
                            </div>
                        )}
                        {alert.status === 'new' && alert.detection_type === 'red_color' && (
                             <div className="alert-actions">
                                <button onClick={() => handleAlertAction(alert.id, 'ignored')}>Dismiss Alarm</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlertsList;