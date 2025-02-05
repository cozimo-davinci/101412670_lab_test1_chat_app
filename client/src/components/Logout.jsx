import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Logout() {
    const { setCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('user');
        setCurrentUser(null);

        toast.success('You have been logged out!', {
            position: 'top-right',
            autoClose: 2000,
        });

        setTimeout(() => {
            navigate('/login');
        }, 2000);
    }, [setCurrentUser, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <ToastContainer />
            <h1 className="text-white text-3xl">Logging out...</h1>
        </div>
    );
}
