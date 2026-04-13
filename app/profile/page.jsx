'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../src/services/api';
import Navbar from '../../components/Fragments/Navbar/index';
import Footer from '../../components/Fragments/Footer';
import Link from 'next/link';
import { User, Mail, Phone, Lock, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [userData, setUserData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
    });
    
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/login?redirect=/profile');
            return;
        }

        // Fetch user data
        authAPI.getMe()
            .then((res) => {
                const user = res.data;
                setUserData({
                    full_name: user.full_name || '',
                    email: user.email || '',
                    phone_number: user.phone_number || '',
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch user data:', err);
                if (err.response?.status === 401) {
                    router.push('/login?redirect=/profile');
                } else {
                    setError('Failed to load profile data');
                    setLoading(false);
                }
            });
    }, [router]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            await authAPI.updateProfile(userData);
            setSuccessMessage('Profile updated successfully');
            
            // Update local storage user data
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
            }
        } catch (err) {
            console.error('Profile update error:', err);
            if (err.response?.status === 422) {
                const errors = Object.values(err.response.data.errors)[0];
                setError(errors ? errors[0] : 'Validation error');
            } else {
                setError('Failed to update profile');
            }
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        // Validate passwords match
        if (passwordData.password !== passwordData.password_confirmation) {
            setError('Password confirmation does not match');
            setSaving(false);
            return;
        }

        // Validate password length
        if (passwordData.password.length < 8) {
            setError('Password must be at least 8 characters');
            setSaving(false);
            return;
        }

        try {
            await authAPI.changePassword({
                current_password: passwordData.current_password,
                password: passwordData.password,
                password_confirmation: passwordData.password_confirmation,
            });
            setSuccessMessage('Password changed successfully');
            setPasswordData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        } catch (err) {
            console.error('Password change error:', err);
            if (err.response?.status === 422) {
                const errors = Object.values(err.response.data.errors)[0];
                setError(errors ? errors[0] : 'Validation error');
            } else if (err.response?.status === 400) {
                setError(err.response.data.message || 'Current password is incorrect');
            } else {
                setError('Failed to change password');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <Navbar />
                <div className='flex items-center justify-center min-h-[60vh]'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                        <p className='text-gray-600'>Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />

            <div className='max-w-4xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='mb-8'>
                    <Link href='/my-bookings' className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4'>
                        <ArrowLeft className='w-4 h-4' />
                        Back to My Bookings
                    </Link>
                    <h1 className='text-3xl font-bold text-gray-900'>Account Settings</h1>
                    <p className='text-gray-600 mt-2'>Manage your profile and password</p>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3'>
                        <CheckCircle className='w-5 h-5 text-green-600 flex-shrink-0' />
                        <p className='text-green-700'>{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3'>
                        <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0' />
                        <p className='text-red-700'>{error}</p>
                    </div>
                )}

                {/* Tabs */}
                <div className='bg-white rounded-lg shadow-sm mb-6'>
                    <div className='border-b'>
                        <nav className='flex gap-6 px-6' aria-label='Tabs'>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                                    activeTab === 'profile'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}>
                                <User className='w-4 h-4 inline mr-2' />
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                                    activeTab === 'password'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}>
                                <Lock className='w-4 h-4 inline mr-2' />
                                Change Password
                            </button>
                        </nav>
                    </div>

                    {/* Profile Form */}
                    {activeTab === 'profile' && (
                        <div className='p-6'>
                            <form onSubmit={handleProfileUpdate} className='space-y-6'>
                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            <User className='w-4 h-4 inline mr-1' />
                                            Full Name
                                        </label>
                                        <input
                                            type='text'
                                            value={userData.full_name}
                                            onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                                            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            <Mail className='w-4 h-4 inline mr-1' />
                                            Email Address
                                        </label>
                                        <input
                                            type='email'
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            <Phone className='w-4 h-4 inline mr-1' />
                                            Phone Number
                                        </label>
                                        <input
                                            type='tel'
                                            value={userData.phone_number}
                                            onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
                                            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                            placeholder='+62xxx'
                                        />
                                    </div>
                                </div>

                                <button
                                    type='submit'
                                    disabled={saving}
                                    className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50'>
                                    <Save className='w-4 h-4' />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Password Form */}
                    {activeTab === 'password' && (
                        <div className='p-6'>
                            <form onSubmit={handlePasswordChange} className='space-y-6'>
                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Current Password
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10'
                                                required
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                                {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            New Password
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10'
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                                {showNewPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        <p className='text-xs text-gray-500 mt-1'>Minimum 8 characters</p>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                                            Confirm New Password
                                        </label>
                                        <div className='relative'>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10'
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        {passwordData.password_confirmation && (
                                            <p className={`text-xs mt-1 ${
                                                passwordData.password === passwordData.password_confirmation
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}>
                                                {passwordData.password === passwordData.password_confirmation
                                                    ? '✓ Passwords match'
                                                    : '✗ Passwords do not match'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type='submit'
                                    disabled={saving}
                                    className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50'>
                                    <Lock className='w-4 h-4' />
                                    {saving ? 'Changing...' : 'Change Password'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className='bg-white rounded-lg shadow-sm p-6'>
                    <h2 className='text-lg font-semibold mb-4'>Quick Links</h2>
                    <div className='space-y-2'>
                        <Link
                            href='/my-bookings'
                            className='block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition'>
                            View My Bookings
                        </Link>
                        <Link
                            href='/hotels'
                            className='block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition'>
                            Browse Hotels
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
