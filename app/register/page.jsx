'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { authAPI } from '../../src/services/api';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        phoneCode: '+62',
        phoneNumber: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.passwordConfirmation) {
            setError('Password dan konfirmasi password tidak cocok.');
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.register({
                full_name: formData.fullName,
                phone_number: formData.phoneNumber,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.passwordConfirmation,
            });

            const { user, token } = response.data.data;
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect to booking engine dashboard after successful registration
            router.push('/booking-engine');
        } catch (err) {
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0];
                setError(firstError ? firstError[0] : 'Validasi error.');
            } else {
                setError('Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            {/* Left Side (Image) */}
            <div className='hidden md:flex md:w-1/2 relative'>
                <img
                    src='https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1920&auto=format&fit=crop'
                    alt='Hotel Room'
                    className='w-full h-full object-cover'
                />
                <div className='absolute bottom-10 left-8 text-white'>
                    <h1 className='text-3xl font-bold'>Welcome!</h1>
                    <h2 className='text-2xl font-bold'>Join NAJJO Central Reservation</h2>
                    <p className='mt-2 text-sm text-gray-200'>Daftar sekarang untuk kemudahan pemesanan hotel.</p>
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className='flex w-full md:w-1/2 justify-center items-center p-6 md:p-12'>
                <form onSubmit={handleRegister}>
                    <div className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
                        {/* Title */}
                        <h2 className='text-center text-2xl font-bold mb-6'>Register</h2>

                        {error && (
                            <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm'>
                                {error}
                            </div>
                        )}

                        {/* Input Fields */}
                        <div className='space-y-4'>
                            {/* Nama Lengkap */}
                            <input
                                type='text'
                                name='fullName'
                                placeholder='Nama Lengkap'
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />

                            {/* Nomor HP */}
                            <PhoneInput
                                country={'id'}
                                value={formData.phoneNumber}
                                onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
                                containerClass='w-full'
                                inputClass='!w-full !py-3 !pl-12 !pr-4 !border !border-gray-300 !rounded-lg focus:!border-blue-500 focus:!ring focus:!ring-blue-200'
                                buttonClass='!border !border-gray-300 !rounded-l-lg'
                                inputProps={{ name: 'phone_number' }}
                            />

                            {/* Email */}
                            <input
                                type='email'
                                name='email'
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />

                            {/* Password */}
                            <input
                                type='password'
                                name='password'
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />

                            {/* Confirm Password */}
                            <input
                                type='password'
                                name='passwordConfirmation'
                                placeholder='Konfirmasi Password'
                                value={formData.passwordConfirmation}
                                onChange={handleChange}
                                required
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />
                        </div>

                        {/* Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                            {loading ? 'Registering...' : 'Register'}
                        </button>

                        {/* Divider */}
                        <div className='flex items-center my-6'>
                            <div className='flex-grow h-px bg-gray-300'></div>
                            <span className='px-2 text-gray-400 text-sm'>atau</span>
                            <div className='flex-grow h-px bg-gray-300'></div>
                        </div>

                        {/* Social Login */}
                        <div className='flex justify-center gap-4'>
                            <button className='p-3 border rounded-full hover:bg-gray-100'>
                                <img src='https://cdn-icons-png.flaticon.com/512/281/281764.png' alt='Facebook' className='h-5 w-5' />
                            </button>
                        </div>

                        {/* Sudah punya akun */}
                        <p className='text-center text-sm text-gray-500 mt-6'>
                            Sudah punya akun?{' '}
                            <Link href='/login' className='text-blue-600 font-medium hover:underline'>
                                Masuk
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
