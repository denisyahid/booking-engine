'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, MapPinned, UserRound, LogOut } from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';

export default function BookingEngineDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading, logout } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login?redirect=/booking-engine');
        }
    }, [loading, isAuthenticated, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (loading || !isAuthenticated) {
        return (
            <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
                <span>Loading your dashboard...</span>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 py-8 px-4'>
            <div className='max-w-5xl mx-auto'>
                <div className='bg-white rounded-xl shadow p-6 md:p-8 mb-6'>
                    <p className='text-sm text-gray-500 mb-2'>Welcome back</p>
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
                        {user?.full_name || user?.name || 'Guest'}
                    </h1>
                    <p className='text-gray-600 mt-2'>
                        Manage your bookings and account in one place.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Link href='/my-bookings' className='bg-white rounded-xl shadow p-6 hover:shadow-md transition'>
                        <div className='flex items-center gap-3 mb-3'>
                            <CalendarDays className='w-6 h-6 text-blue-600' />
                            <h2 className='text-lg font-semibold text-gray-800'>My Bookings</h2>
                        </div>
                        <p className='text-sm text-gray-600'>
                            View booking history, status, and booking details.
                        </p>
                    </Link>

                    <Link href='/profile' className='bg-white rounded-xl shadow p-6 hover:shadow-md transition'>
                        <div className='flex items-center gap-3 mb-3'>
                            <UserRound className='w-6 h-6 text-blue-600' />
                            <h2 className='text-lg font-semibold text-gray-800'>My Profile</h2>
                        </div>
                        <p className='text-sm text-gray-600'>
                            Update your personal information and account details.
                        </p>
                    </Link>

                    <Link href='/destination' className='bg-white rounded-xl shadow p-6 hover:shadow-md transition'>
                        <div className='flex items-center gap-3 mb-3'>
                            <MapPinned className='w-6 h-6 text-blue-600' />
                            <h2 className='text-lg font-semibold text-gray-800'>Book New Stay</h2>
                        </div>
                        <p className='text-sm text-gray-600'>
                            Explore destinations and make a new reservation.
                        </p>
                    </Link>

                    <button
                        type='button'
                        onClick={handleLogout}
                        className='text-left bg-white rounded-xl shadow p-6 hover:shadow-md transition'>
                        <div className='flex items-center gap-3 mb-3'>
                            <LogOut className='w-6 h-6 text-red-500' />
                            <h2 className='text-lg font-semibold text-gray-800'>Logout</h2>
                        </div>
                        <p className='text-sm text-gray-600'>
                            Sign out from your booking engine account.
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}
