// frontend/src/pages/LoginPage.js

import React from 'react';
// Yeh line check karein, yeh maan rahi hai ki Auth.js components folder me hai
import Auth from '../components/Auth'; 

const LoginPage = () => {
    return (
        <div className="login-page">
            <Auth />
        </div>
    );
};

export default LoginPage;