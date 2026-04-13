'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { bookingAPI } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import { Calendar, MapPin, Bed, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function MyBookingsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/my-bookings');
            return;
        }

        if (user?.email) {
            bookingAPI.getMyBookings({ email: user.email })
                .then((res) => {
                    setBookings(res.data.data || []);
                })
                .catch(() => {
                    setError('Failed to load bookings');
                })
                .finally(() => setLoading(false));
        }
    }, [user, isAuthenticated, router]);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'paid':
                return <CheckCircle className='w-5 h-5 text-green-500' />;
            case 'pending':
            case 'pending_payment':
                return <Clock className='w-5 h-5 text-yellow-500' />;
            case 'cancelled':
            case 'payment_denied':
                return <XCircle className='w-5 h-5 text-red-500' />;
            default:
                return <AlertCircle className='w-5 h-5 text-gray-500' />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'paid':
                return 'text-green-600 bg-green-50';
            case 'pending':
            case 'pending_payment':
                return 'text-yellow-600 bg-yellow-50';
            case 'cancelled':
            case 'payment_denied':
            case 'payment_expired':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
                <span>Loading your bookings...</span>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 py-8 px-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold text-gray-800'>My Bookings</h1>
                    <Link
                        href='/destination'
                        className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'>
                        Book New Hotel
                    </Link>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm'>
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className='bg-white rounded-lg shadow p-8 text-center'>
                        <Calendar className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                        <h2 className='text-xl font-semibold text-gray-700 mb-2'>No Bookings Yet</h2>
                        <p className='text-gray-500 mb-6'>
                            You haven&apos;t made any bookings yet. Start exploring hotels and book your next stay!
                        </p>
                        <Link
                            href='/destination'
                            className='inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition'>
                            Explore Hotels
                        </Link>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {bookings.map((booking) => (
                            <div key={booking.id} className='bg-white rounded-lg shadow p-6'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            {getStatusIcon(booking.status)}
                                            <span className='text-lg font-semibold text-gray-800'>
                                                {booking.booking_code}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                                {booking.status?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>

                                        <div className='grid grid-cols-2 gap-2 text-sm text-gray-600'>
                                            <div className='flex items-center gap-2'>
                                                <MapPin className='w-4 h-4' />
                                                <span>{booking.hotel?.name || 'NAJJ Hotel'}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Bed className='w-4 h-4' />
                                                <span>{booking.room?.name || 'Room'}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Calendar className='w-4 h-4' />
                                                <span>{booking.check_in} → {booking.check_out}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-semibold text-primary'>
                                                    IDR {booking.total?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex gap-2'>
                                        <Link
                                            href={`/my-bookings/${booking.invoice_number || booking.booking_code}`}
                                            className='px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition'>
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
