import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';

const AlertsList = () => {
    const [alerts, setAlerts] = useState([]);
    const alarmSound = useRef(null);

    // ... (useEffect for fetching and subscribing to alerts remains the same)
    useEffect(() => {
        const fetchAlerts = async () => {
            const { data, error } = await supabase
                .from('alerts')
                .select('*, cameras(name)')
                .order('created_at', { ascending: false });
            if (error) console.error('Error fetching alerts:', error);
            else setAlerts(data || []);
        };

        fetchAlerts();

        const subscription = supabase
            .channel('public:alerts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, (payload) => {
                const fetchNewAlertDetails = async () => {
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
            alarmSound.current.play().catch(e => console.log("Audio play failed.", e));
        }
    }

    const stopAlarm = () => {
        if (alarmSound.current) {
            alarmSound.current.pause();
            alarmSound.current.currentTime = 0; // Rewind to start
        }
    };

    const handleAlertAction = async (alertId, newStatus) => {
        stopAlarm(); // Stop alarm when any action is taken
        const { error } = await supabase
            .from('alerts')
            .update({ status: newStatus })
            .eq('id', alertId);

        if (error) console.error('Error updating alert:', error);
        else setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    };

    return (
        <div className="alerts-list">
            <h2>Alerts</h2>
            <audio ref={alarmSound} src="/alarm.mp3" preload="auto" loop></audio>
            
            <button className="stop-alarm-btn" onClick={stopAlarm}>STOP ALARM</button>

            <ul>
                {alerts.map(alert => (
                    <li key={alert.id} className={`alert-item status-${alert.status}`}>
                        <strong>{alert.detection_type.replace('_', ' ').toUpperCase()} Detected!</strong>
                        <p>Camera: {alert.cameras ? alert.cameras.name : '...'} | Time: {new Date(alert.created_at).toLocaleTimeString()}</p>
                        
                        {alert.status === 'new' && (
                             <div className="alert-actions">
                                <button onClick={() => handleAlertAction(alert.id, 'ignored')}>Dismiss</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlertsList;