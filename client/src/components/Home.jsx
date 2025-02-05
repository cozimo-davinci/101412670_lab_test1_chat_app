import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Header */}
            <header className="py-2">
                <h1 className="text-3xl font-bold text-center">Apex Management</h1>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center px-4">
                <h2 className="text-2xl font-bold mt-8">Welcome to Bloomy App</h2>
                <div className="bg-black w-full max-w-4xl border-white border-4 rounded-md mt-6 p-8 shadow-md shadow-red-600 hover:scale-105 hover:shadow-white transition-transform">
                    <p className="bg-white p-6 text-lg font-bold text-black border-white border-4 shadow-md shadow-teal-500 rounded-md">
                        Bloomy App is a web application that allows you to chat woth your friends.
                    </p>
                </div>
                <button className="bg-orange-500 text-white font-bold w-64 h-12 rounded-md mt-6 hover:bg-blue-600 transition-colors">
                    <Link to="/login">Get Started</Link>
                </button>
            </main>

            {/* Footer */}
            <footer className="bg-orange-600 py-4
             border-white border-4 border-r-0 border-l-0 border-b-0">
                <p className="text-center text-white font-semibold">© 2024 Apex Management. All rights reserved.</p>
            </footer>
        </div>
    );
}
