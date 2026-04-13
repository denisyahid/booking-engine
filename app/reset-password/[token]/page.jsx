'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../../src/services/api';

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useParams();
    const token = params?.token;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = () => {
        setError('');
        setSuccessMessage('');

        if (!email || !password || !confirmPassword) {
            setError('Semua field harus diisi');
            return false;
        }

        if (password.length < 8) {
            setError('Password minimal 8 karakter');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak cocok');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await authAPI.resetPassword({
                email,
                password,
                password_confirmation: confirmPassword,
                token,
            });

            setSuccessMessage('Password berhasil direset. Silakan login dengan password baru Anda.');
            
            // Redirect after short delay
            setTimeout(() => {
                router.push('/login?message=Password berhasil direset');
            }, 2000);
        } catch (err) {
            if (err.response?.status === 400) {
                // Handle validation errors from API
                const apiErrors = err.response?.data?.errors;
                if (apiErrors) {
                    // Flatten error messages into a single string
                    const errorMessages = Object.values(apiErrors).flat();
                    setError(errorMessages.join('. '));
                } else {
                    setError(err.response?.data?.message || 'Data yang Anda masukkan tidak valid');
                }
            } else if (err.response?.status === 401) {
                setError('Token reset password tidak valid atau sudah kadaluarsa');
            } else if (err.response?.status === 404) {
                setError('Email tidak ditemukan');
            } else {
                setError('Gagal mereset password. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        if (password.length === 0) return { text: '', color: '', width: '0%' };
        if (password.length < 8) return { text: 'Lemah', color: 'bg-red-500', width: '33%' };
        if (password.length < 12) return { text: 'Sedang', color: 'bg-yellow-500', width: '66%' };
        return { text: 'Kuat', color: 'bg-green-500', width: '100%' };
    };

    const strength = getPasswordStrength();

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
                    <h2 className='text-center text-2xl font-bold mb-2'>Reset Password</h2>
                    <p className='text-center text-sm text-gray-500 mb-6'>
                        Masukkan email dan password baru Anda
                    </p>

                    {error && (
                        <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm'>
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className='mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm'>
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className='space-y-4'>
                            {/* Email Field */}
                            <div>
                                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                                    Email
                                </label>
                                <input
                                    id='email'
                                    type='email'
                                    placeholder='Masukkan email Anda'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed'
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                                    Password Baru
                                </label>
                                <div className='relative'>
                                    <input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Minimal 8 karakter'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed pr-12'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
                                            </svg>
                                        ) : (
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <div className='mt-2'>
                                        <div className='flex items-center justify-between text-xs mb-1'>
                                            <span className='text-gray-500'>Kekuatan password:</span>
                                            <span className={`font-medium ${strength.color.replace('bg-', 'text-')}`}>
                                                {strength.text}
                                            </span>
                                        </div>
                                        <div className='w-full h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                                            <div
                                                className={`h-full ${strength.color} transition-all duration-300`}
                                                style={{ width: strength.width }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1'>
                                    Konfirmasi Password Baru
                                </label>
                                <div className='relative'>
                                    <input
                                        id='confirmPassword'
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder='Ulangi password baru'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed pr-12'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
                                            </svg>
                                        ) : (
                                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className='mt-1 text-xs text-red-500'>Password tidak cocok</p>
                                )}
                                {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
                                    <p className='mt-1 text-xs text-green-500'>Password cocok</p>
                                )}
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? (
                                <span className='flex items-center justify-center'>
                                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    Mereset Password...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                        <p className='text-center text-sm text-gray-500 mt-6'>
                            Sudah ingat password Anda?{' '}
                            <Link href='/login' className='text-blue-600 font-medium hover:underline'>
                                Kembali ke Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
