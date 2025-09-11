import axios from 'axios';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            {/* Left Side (Image) */}
            <div className='hidden md:flex md:w-1/2 relative'>
                <img src='/images/room10.jpg' alt='Hotel Room' className='w-full h-full object-cover' />
                <div className='absolute bottom-10 left-8 text-white'>
                    <h1 className='text-3xl font-bold'>System</h1>
                    <h2 className='text-2xl font-bold'>NAJJO Central Reservation System</h2>
                    <ul className='mt-4 space-y-1 text-sm'>
                        <li>✔ Efficient Booking Management</li>
                        <li>✔ Operational Efficiency</li>
                        <li>✔ Increased Revenue Potential</li>
                        <li>✔ Data Insights & Reporting</li>
                    </ul>
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className='flex w-full md:w-1/2 justify-center items-center p-6 md:p-12'>
                <form onSubmit="">
                    <div className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
                        {/* Logo */}
                        {/* <div className='flex justify-center mb-6'>
                            <img src='/logo.png' alt='Logo' className='h-12' />
                        </div> */}

                        {/* Title */}
                        <h2 className='text-center text-2xl font-bold mb-6'>Login</h2>

                        {/* Input Fields */}
                        <div className='space-y-4'>
                            <input
                                type='email'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />
                            <input
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />
                        </div>

                        {/* Forgot Password */}
                        <div className='flex justify-end mt-2'>
                            <a href='#' className='text-sm text-blue-600 hover:underline'>
                                Forgot password?
                            </a>
                        </div>

                        {/* Button */}
                        <button className='w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200'>
                            Log in
                        </button>

                        {/* Divider */}
                        <div className='flex items-center my-6'>
                            <div className='flex-grow h-px bg-gray-300'></div>
                            <span className='px-2 text-gray-400 text-sm'>atau</span>
                            <div className='flex-grow h-px bg-gray-300'></div>
                        </div>

                        {/* Social Login */}
                        <div className='flex justify-center gap-4'>
                            <a className=' flex items-center justify-center' href='http://127.0.0.1:8000/api/auth/google/redirect'>
                                <button className='p-3 border rounded-full hover:bg-gray-100'>
                                    <img src='https://cdn-icons-png.flaticon.com/512/281/281764.png' alt='Facebook' className='h-5 w-5' />
                                </button>
                            </a>
                        </div>

                        {/* Register */}
                        <p className='text-center text-sm text-gray-500 mt-6'>
                            Belum punya akun?{' '}
                            <a href='/register' className='text-blue-600 font-medium hover:underline'>
                                Daftar
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
