import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function LoginForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Call your backend login endpoint
            const response = await axios.post('http://localhost:7000/api/auth/login', {
                username,
                password,
            });

            // Assuming your backend returns { success: true, user: { ... }, message: '...' }
            const { success, user, message } = response.data;

            if (success) {
                // Store user session in localStorage (you can store token or user details)
                localStorage.setItem('user', JSON.stringify(user));

                // Show success notification
                toast.success(message || 'Login successful!', {
                    position: 'top-right',
                    transition: 'bounce',
                    autoClose: 3000,
                });

                // Navigate to dashboard after a short delay
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } else {
                // Show error notification if login failed
                toast.error(message || 'Invalid credentials. Please try again.', {
                    position: 'top-right',
                });
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                'An error occurred during login! Please try again.';
            toast.error(errorMessage, {
                position: 'top-right',
            });
        }
    };

    return (
        <div className="bg-black w-96 h-auto py-8 px-6 rounded-lg shadow-lg shadow-slate-300 
      flex justify-center items-center mx-auto my-20 
      transition-transform duration-300 ease-in-out hover:scale-105
      border-white border-4">
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col justify-center items-center">
                    <label className="text-white font-semibold text-2xl mt-4">Username</label>
                    <input
                        type="text"
                        value={username}
                        className="w-80 h-10 rounded-md mt-2 px-2"
                        placeholder="Enter your username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="text-white font-semibold text-2xl mt-4">Password</label>
                    <input
                        type="password"
                        value={password}
                        className="w-80 h-10 rounded-md mt-2 px-2"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-orange-500 text-white font-bold w-80 h-10 rounded-md mt-6 hover:bg-blue-600 transition-colors"
                    >
                        Login
                    </button>
                    <Link
                        className="mt-5 mb-3 text-xl text-white font-semibold"
                        to="/signup"
                    >
                        Don't have an account?{' '}
                        <span className="text-blue-700 font-bold hover:scale-105">Sign Up</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}
