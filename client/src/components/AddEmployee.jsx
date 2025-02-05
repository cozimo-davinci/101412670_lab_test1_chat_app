import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddEmployee() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [department, setDepartment] = useState('');

    const navigate = useNavigate();

    const handleAddEmployee = async (e) => {
        e.preventDefault();

        // Validate input
        if (!firstName || !lastName || !email || !position || !salary || !dateOfJoining || !department) {
            toast.error('All fields are required.', { position: 'top-right' });
            return;
        }

        if (isNaN(Number(salary))) {
            toast.error('Salary must be a valid number.', { position: 'top-right' });
            return;
        }

        try {
            const response = await axios.post('https://apex-management-system-backend.onrender.com/api/v1/emp/employees', {
                first_name: firstName,
                last_name: lastName,
                email: email,
                position: position,
                salary: Number(salary), // Ensure salary is a number
                date_of_joining: new Date(dateOfJoining), // Ensure date is valid
                department: department,
            });

            if (response.status === 201) {
                toast.success('Employee added successfully!', {
                    position: 'top-right',
                    autoClose: 3000, // 3 seconds
                });

                // Clear form fields
                setFirstName('');
                setLastName('');
                setEmail('');
                setPosition('');
                setSalary('');
                setDateOfJoining('');
                setDepartment('');

                // Navigate after delay to allow the user to see the notification
                setTimeout(() => {
                    navigate('/employee');
                }, 3000);
            } else {
                toast.error('Failed to add employee. Please try again.', { position: 'top-right' });
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            const errorMessage =
                error.response?.data?.message || 'An error occurred while adding the employee. Please try again.';
            toast.error(errorMessage, { position: 'top-right' });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-black">
            {/* Toastify Container */}
            <ToastContainer />

            <Link
                to="/employee"
                className="absolute top-20 left-8
                 text-white font-bold bg-purple-600 
                 rounded-md shadow-md shadow-white hover:shadow-yellow-400 p-4
                 border-black border-4 hover:scale-105"
            >
                Back
            </Link>

            <div className="bg-black w-full max-w-md py-8 px-14 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105
             transition-shadow duration-300 border-white border-4 shadow-yellow-500">
                <h1 className="text-2xl font-bold text-white text-center mb-6">Add Employee</h1>

                <form onSubmit={handleAddEmployee} className="space-y-5">
                    <div>
                        <label className="block text-white font-semibold mb-1">First Name</label>
                        <input
                            type="text"
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-1">Last Name</label>
                        <input
                            type="text"
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-1">Position</label>
                        <input
                            type="text"
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-1">Salary</label>
                        <input
                            type="text"
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-1">Date of Joining</label>
                        <input
                            type="date"
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={dateOfJoining}
                            onChange={(e) => setDateOfJoining(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-1">Department</label>
                        <input
                            type="text"
                            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-10 bg-orange-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Add Employee
                    </button>
                </form>
            </div>
        </div>
    );
}
