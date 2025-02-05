import './App.css';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import { Routes, Route, BrowserRouter, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <BrowserRouter>
        {/* ToastContainer to show toast notifications globally */}
        <ToastContainer />

        {/* Navigation */}
        <nav className="bg-amber-600 border-white border-4 
        border-t-0 border-r-0 border-l-0 shadow-md shadow-white 
        py-4 px-8 flex justify-end space-x-6">
          <Link to="/home" className="text-white text-lg hover:underline font-bold hover:text-black">
            Home
          </Link>
          <Link to="/login" className="text-white text-lg hover:underline font-bold hover:text-black">
            Login
          </Link>
          <Link to="/signup" className="text-white text-lg  hover:underline font-bold hover:text-black">
            Sign Up
          </Link>
        </nav>

        {/* Routes */}
        <main className="flex-grow">
          <Routes>

            {/* Redirect to /home if the root path is accessed */}
            <Route path="/" element={<Navigate to="/home" />} />

            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </main>


      </BrowserRouter>
    </div>
  );
}

export default App;
