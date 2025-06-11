// frontend/src/App.js
import './App.css';
import { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading Application...</div>;
    }

    return (
        <div className="App">
            {!session ? <LoginPage /> : <Dashboard key={session.user.id} session={session} />}
        </div>
    );
}

export default App;