import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUpForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Validate that all fields are provided
        if (!email || !username || !password || !firstname || !lastname) {
            toast.error("All fields are required", { position: "top-right" });
            return;
        }

        try {
            // Call your backend signup endpoint
            const response = await axios.post('http://localhost:7000/api/auth/signup', {
                email,
                username,
                password,
                firstname,
                lastname,
            });

            // Assuming your backend returns { success: true, message: 'User created successfully!' }
            const { success, message } = response.data;

            if (success) {
                toast.success(message || 'User created successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                // After successful signup, navigate to login page after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                toast.error(message || 'User creation failed.', {
                    position: 'top-right',
                });
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'An error occurred during sign-up.';
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
            <form onSubmit={handleSignUp}>
                <div className="flex flex-col justify-center items-center">
                    <label className="text-white font-semibold text-2xl mt-4">Email</label>
                    <input
                        type="email"
                        className="w-80 h-10 rounded-md mt-2 px-2"
                        placeholder="salazar@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="text-white font-semibold text-2xl mt-4">Username</label>
                    <input
                        type="text"
                        className="w-80 h-10 rounded-md mt-2 px-2"
                        placeholder="salazar15"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="text-white font-semibold text-2xl mt-4">First Name</label>
                    <input
                        type="text"
                        className="w-80 h-10 rounded-md mt-2 px-2"
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                    <label className="text-white font-semibold text-2xl mt-4">Last Name</label>
                    <input
                        type="text"
                        className="w-80 h-10 rounded-md mt-2 px-2"
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                    <label className="text-white font-semibold text-2xl mt-4">Password</label>
                    <input
                        type="password"
                        className="w-80 h-10 rounded-md mt-2 px-2"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-orange-500 text-white font-bold w-80 h-10 rounded-md mt-6 hover:bg-blue-600 transition-colors"
                    >
                        Sign Up
                    </button>
                    <Link className="mt-5 mb-3 text-xl text-white font-semibold" to="/login">
                        Already have an account?{' '}
                        <span className="text-blue-700 font-bold hover:scale-105">Sign In</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}
