import { useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneCode: '+62',
        phoneNumber: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.target;
        try {
            console.log(form.fullName.value);
            const data = await axios
                .post('http://127.0.0.1:8000/api/register', {
                    name: formData.fullName,
                    phone_number: formData.phoneNumber, 
                    email: formData.email,
                    password: formData.password,
                })
                .then((res) => console.log(res.data));
        } catch (err) {
            console.log(err);
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
                        {/* Logo */}
                        <div className='flex justify-center mb-6'>
                            <img src='/logo.png' alt='Logo' className='h-12' />
                        </div>

                        {/* Title */}
                        <h2 className='text-center text-2xl font-bold mb-6'>Register</h2>

                        {/* Input Fields */}
                        <div className='space-y-4'>
                            {/* Nama Lengkap */}
                            <input
                                type='text'
                                name='fullName'
                                placeholder='Nama Lengkap'
                                value={formData.fullName}
                                onChange={handleChange}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />

                            {/* Nomor HP */}
                            <div className='flex gap-2'>
                                <PhoneInput
                                    country={'id'} // default Indonesia
                                    value={formData.phoneNumber}
                                    onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
                                    containerClass='w-full' 
                                    inputClass='!w-full !py-3 !pl-12 !pr-4 !border !border-gray-300 !rounded-lg focus:!border-blue-500 focus:!ring focus:!ring-blue-200'
                                    buttonClass='!border !border-gray-300 !rounded-l-lg'
                                    inputProps={{ name: 'phone_number' }}
                                />
                            </div>

                            {/* Email */}
                            <input
                                type='email'
                                name='email'
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />

                            {/* Password */}
                            <input
                                type='password'
                                name='password'
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
                            />
                        </div>

                        {/* Button */}
                        <button
                            type='submit'
                            className='w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200'>
                            Register
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
                            <a href='/login' className='text-blue-600 font-medium hover:underline'>
                                Masuk
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
