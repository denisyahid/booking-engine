'use client';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { bookingAPI } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import Navbar from '../../components/Fragments/Navbar';
import Footer from '../../components/Fragments/Footer';
import { Calendar, MapPin, Bed, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://127.0.0.1:8000/api';
const STORAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${STORAGE_BASE_URL}/storage/${path}`;
};

export default function MyBookingsPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isFetchingRef = useRef(false);
    const hasFetchedForUserRef = useRef('');
    const userId = user?.id || null;
    const userEmail = user?.email || '';

    const fetchMyBookings = async (force = false) => {
        if (isFetchingRef.current && !force) return;
        const userKey = userId ? `id:${userId}` : `email:${userEmail}`;
        if (!force && hasFetchedForUserRef.current === userKey) return;

        try {
            isFetchingRef.current = true;
            setError('');
            const params = userEmail ? { email: userEmail } : {};
            const res = await bookingAPI.getMyBookings(params);
            setBookings(res.data.data || []);
            hasFetchedForUserRef.current = userKey;
        } catch (e) {
            if (e?.response?.status === 429) {
                setError('Terlalu banyak request. Tunggu beberapa detik lalu klik Refresh.');
            } else {
                setError('Failed to load bookings');
            }
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login?redirect=/my-bookings');
            return;
        }
        if (userEmail) {
            fetchMyBookings();
            return;
        }
        setLoading(false);
    }, [authLoading, userId, userEmail, isAuthenticated, router]);

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

    const formatDate = (value) => {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className='min-h-screen bg-gray-100 flex items-center justify-center mt-14'>
                    <span>Loading your bookings...</span>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-100 py-8 px-4 mt-14'>
                <div className='max-w-4xl mx-auto'>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-2xl font-bold text-gray-800'>My Bookings</h1>
                        <div className='flex items-center gap-2'>
                            <button
                                type='button'
                                onClick={() => fetchMyBookings(true)}
                                className='px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition'>
                                Refresh
                            </button>
                            <Link
                                href='/destination'
                                className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'>
                                Book New Hotel
                            </Link>
                        </div>
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
                                <div key={booking.id} className='bg-white rounded-lg shadow overflow-hidden'>
                                    <div className='flex flex-col md:flex-row'>
                                        <div className='w-full md:w-44 h-36 md:h-auto bg-gray-100'>
                                            {getImageUrl(booking.room?.images?.[0]) ? (
                                                <img
                                                    src={getImageUrl(booking.room?.images?.[0])}
                                                    alt={booking.room?.name || booking.hotel?.name || 'Room'}
                                                    className='w-full h-full object-cover'
                                                />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-gray-400 text-sm'>
                                                    No Room Photo
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex-1 p-6'>
                                            <div className='flex items-center gap-3 mb-2'>
                                                {getStatusIcon(booking.status)}
                                                <span className='text-lg font-semibold text-gray-800'>
                                                    {booking.booking_code}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                                    {booking.status?.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>

                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600'>
                                                <div className='flex items-center gap-2'>
                                                    <MapPin className='w-4 h-4' />
                                                    <span>{booking.hotel?.name || 'NAJJ Hotel'}{booking.hotel?.location ? ` - ${booking.hotel.location}` : ''}</span>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Bed className='w-4 h-4' />
                                                    <span>{booking.room?.name || 'Room'}</span>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Calendar className='w-4 h-4' />
                                                    <span>{formatDate(booking.check_in)} → {formatDate(booking.check_out)}</span>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-semibold text-primary'>
                                                        IDR {booking.total?.toLocaleString()} ({booking.nights || 1} malam)
                                                    </span>
                                                </div>
                                                {booking.hotel?.address && (
                                                    <div className='md:col-span-2 text-xs text-gray-500'>
                                                        {booking.hotel.address}
                                                    </div>
                                                )}
                                            </div>

                                            <div className='flex gap-2 mt-4'>
                                                <Link
                                                    href={`/my-bookings/${booking.invoice_number || booking.booking_code}`}
                                                    className='px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition'>
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
