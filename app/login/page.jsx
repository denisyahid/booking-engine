'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [showForgot, setShowForgot] = useState(false);
    const [forgotMessage, setForgotMessage] = useState('');

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.replace('/my-bookings');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(email, password);
            const { user, token } = response.data.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(user));

            const redirectTo = searchParams.get('redirect');
            router.push(redirectTo || '/booking-engine');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Email atau password salah');
            } else if (err.response?.status === 403) {
                setError('Akun Anda tidak aktif. Hubungi support.');
            } else {
                setError('Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setForgotMessage('');
        setError('');

        try {
            await authAPI.forgotPassword(forgotEmail);
            setForgotMessage('Link reset password telah dikirim ke email Anda.');
        } catch (err) {
            setError('Gagal mengirim link reset password.');
        } finally {
            setLoading(false);
        }
    };

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
                <div className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
                    <h2 className='text-center text-2xl font-bold mb-6'>
                        {showForgot ? 'Forgot Password' : 'Login'}
                    </h2>

                    {error && (
                        <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm'>
                            {error}
                        </div>
                    )}

                    {forgotMessage && (
                        <div className='mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm'>
                            {forgotMessage}
                        </div>
                    )}

                    {!showForgot ? (
                        <form onSubmit={handleLogin}>
                            <div className='space-y-4'>
                                <input
                                    type='email'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                                />
                                <input
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                                />
                            </div>

                            <div className='flex justify-end mt-2'>
                                <button
                                    type='button'
                                    onClick={() => setShowForgot(true)}
                                    className='text-sm text-blue-600 hover:underline'
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>

                            <div className='flex items-center my-6'>
                                <div className='flex-grow h-px bg-gray-300'></div>
                                <span className='px-2 text-gray-400 text-sm'>atau</span>
                                <div className='flex-grow h-px bg-gray-300'></div>
                            </div>

                            <div className='flex justify-center gap-4'>
                                <a className='flex items-center justify-center' href='http://10.108.118.71:8000/api/auth/google/redirect'>
                                    <button className='p-3 border rounded-full hover:bg-gray-100'>
                                        <img src='https://cdn-icons-png.flaticon.com/512/281/281764.png' alt='Google' className='h-5 w-5' />
                                    </button>
                                </a>
                            </div>

                            <p className='text-center text-sm text-gray-500 mt-6'>
                                Belum punya akun?{' '}
                                <Link href='/register' className='text-blue-600 font-medium hover:underline'>
                                    Daftar
                                </Link>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleForgotPassword}>
                            <div className='space-y-4'>
                                <p className='text-sm text-gray-600'>
                                    Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
                                </p>
                                <input
                                    type='email'
                                    placeholder='Email'
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                                />
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <button
                                type='button'
                                onClick={() => setShowForgot(false)}
                                className='w-full mt-3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition duration-200'
                            >
                                Back to Login
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
