import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Remove user data from localStorage
        localStorage.removeItem('user');

        // Optionally show a toast notification for logout
        toast.success('You have been logged out!', {
            position: 'top-right',
            autoClose: 2000,
        });

        // Redirect to the login page after a brief delay
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <ToastContainer />
            <h1 className="text-white text-3xl">Logging out...</h1>
        </div>
    );
}
