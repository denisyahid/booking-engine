'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../../../components/Fragments/Navbar';
import Footer from '../../../components/Fragments/Footer';
import { bookingAPI } from '../../../src/services/api';
import { useAuth } from '../../../src/context/AuthContext';

export default function GuestBookingPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const roomId = params.id;
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    // Get booking data from URL
    const subroomId = searchParams.get('subroom_id');
    const selectedRoomId = searchParams.get('room_id');
    const rateId = searchParams.get('rate_id');
    const rateName = searchParams.get('rate_name');
    const checkIn = searchParams.get('check_in');
    const checkOut = searchParams.get('check_out');
    const pricePerNight = parseInt(searchParams.get('price_per_night')) || 0;
    const totalPrice = parseInt(searchParams.get('total_price')) || 0;
    const nights = parseInt(searchParams.get('nights')) || 1;

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [createdBookingCode, setCreatedBookingCode] = useState('');
    const [hotelInfo, setHotelInfo] = useState(null);

    // Form state
    const [form, setForm] = useState({
        title: 'Mr',
        full_name: '',
        email: '',
        phone: '',
        special_request: '',
    });

    // Booking page requires login first, then continue booking flow
    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            const query = searchParams.toString();
            const redirectTarget = query ? `${pathname}?${query}` : pathname;
            router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
        }
    }, [authLoading, isAuthenticated, pathname, router, searchParams]);

    // Autofill guest data from logged-in account
    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                full_name: user.full_name || prev.full_name,
                email: user.email || prev.email,
                phone: user.phone_number || prev.phone,
            }));
        }
    }, [user]);

    // Fetch hotel info
    useEffect(() => {
        if (roomId) {
            axios.get(`http://127.0.0.1:8000/api/hotel/${roomId}`)
                .then(res => setHotelInfo(res.data))
                .catch(err => console.error('Failed to load hotel:', err));
        }
    }, [roomId]);

    // Get CSRF token before submitting
    const getCsrfToken = async () => {
        try {
            await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
                withCredentials: true,
            });
        } catch (error) {
            console.error('Failed to get CSRF token:', error);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setForm(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            const query = searchParams.toString();
            const redirectTarget = query ? `${pathname}?${query}` : pathname;
            router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
            return;
        }
        setSubmitting(true);
        setError('');

        try {
            // Create booking
            const response = await bookingAPI.createLegacy({
                room_id: parseInt(selectedRoomId || roomId),
                subroom_id: subroomId ? parseInt(subroomId) : null,
                rate_id: rateId ? parseInt(rateId) : null,
                title: form.title,
                fullname: form.full_name,
                email: form.email,
                mobile_number: form.phone,
                special_request: form.special_request,
                check_in: checkIn,
                check_out: checkOut,
                total: totalPrice,
                adult: 1,
                children: 0,
                roomQuantity: 1,
            });

            if (response.data.success) {
                const booking = response.data.booking;
                const bookingCode = booking.invoice_number || booking.booking_code || '';
                setBookingData(booking);
                setCreatedBookingCode(bookingCode);
                setSuccess(true);
            } else {
                setError(response.data.message || 'Failed to create booking');
            }
        } catch (err) {
            console.error('Booking error:', err);
            setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

    if (success && bookingData) {
        return (
            <>
                <Navbar />
                <div className='min-h-screen bg-gray-100 py-10 px-4 mt-14'>
                    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
                        <div className='bg-green-600 text-white p-6 text-center'>
                            <CheckCircle className='w-16 h-16 mx-auto mb-4' />
                            <h2 className='text-2xl font-bold'>Booking Successful!</h2>
                        </div>
                        <div className='p-6 space-y-4'>
                            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                                <p className='text-sm text-green-600 mb-1'>Booking Code</p>
                                <p className='text-2xl font-bold text-green-800'>{bookingData.invoice_number || bookingData.booking_code || `NAJ${bookingData.id}`}</p>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm text-gray-500'>Guest Name</p>
                                    <p className='font-medium'>{bookingData.fullname || form.full_name}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Email</p>
                                    <p className='font-medium'>{bookingData.email || form.email}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Check-In</p>
                                    <p className='font-medium'>{checkIn}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Check-Out</p>
                                    <p className='font-medium'>{checkOut}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Nights</p>
                                    <p className='font-medium'>{nights}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-500'>Total</p>
                                    <p className='font-bold text-primary'>{formatRupiah(totalPrice)}</p>
                                </div>
                            </div>
                            <div className='flex gap-3 mt-6'>
                                {createdBookingCode && (
                                    <button
                                        onClick={() =>
                                            router.push(
                                                isAuthenticated
                                                    ? `/payment-gateway/${createdBookingCode}`
                                                    : `/login?redirect=${encodeURIComponent(`/payment-gateway/${createdBookingCode}`)}`
                                            )
                                        }
                                        className='flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition'>
                                        Continue to Payment
                                    </button>
                                )}
                                <button
                                    onClick={() => router.push('/')}
                                    className='flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition'>
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-100 py-10 px-4 mt-14'>
                <div className='max-w-4xl mx-auto'>
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className='flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6'>
                        <ArrowLeft className='w-5 h-5' />
                        <span>Back to Hotel</span>
                    </button>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {/* Booking Form */}
                        <div className='md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden'>
                            <div className='bg-primary text-white p-5'>
                                <h2 className='text-xl font-bold'>Complete Your Booking</h2>
                                <p className='text-sm text-white/80 mt-1'>Fill in your details to book this room</p>
                            </div>

                            {error && (
                                <div className='m-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2'>
                                    <XCircle className='w-5 h-5' />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className='p-5 space-y-4'>
                                {/* Personal Info */}
                                <div>
                                    <h3 className='font-semibold text-gray-800 mb-3'>Personal Information</h3>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <div>
                                            <label className='block text-sm text-gray-600 mb-1'>Title</label>
                                            <select
                                                id='title'
                                                value={form.title}
                                                onChange={handleInputChange}
                                                className='w-full border rounded-lg p-2'>
                                                <option value='Mr'>Mr</option>
                                                <option value='Mrs'>Mrs</option>
                                                <option value='Ms'>Ms</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className='block text-sm text-gray-600 mb-1'>Full Name *</label>
                                            <input
                                                type='text'
                                                id='full_name'
                                                value={form.full_name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder='John Doe'
                                                className='w-full border rounded-lg p-2'
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <label className='block text-sm text-gray-600 mb-1'>Email *</label>
                                            <input
                                                type='email'
                                                id='email'
                                                value={form.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder='john@example.com'
                                                className='w-full border rounded-lg p-2'
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <label className='block text-sm text-gray-600 mb-1'>Phone Number *</label>
                                            <input
                                                type='tel'
                                                id='phone'
                                                value={form.phone}
                                                onChange={handleInputChange}
                                                required
                                                placeholder='+6281234567890'
                                                className='w-full border rounded-lg p-2'
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Special Request */}
                                <div>
                                    <h3 className='font-semibold text-gray-800 mb-3'>Special Request</h3>
                                    <textarea
                                        id='special_request'
                                        value={form.special_request}
                                        onChange={handleInputChange}
                                        placeholder='Any special requests or needs?'
                                        rows='3'
                                        className='w-full border rounded-lg p-2'
                                    />
                                </div>

                                <button
                                    type='submit'
                                    disabled={submitting}
                                    className='w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                                    {submitting ? (
                                        <>
                                            <Loader2 className='w-5 h-5 animate-spin' />
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Booking Summary */}
                        <div className='space-y-6'>
                            {/* Hotel Info */}
                            {hotelInfo && (
                                <div className='bg-white rounded-lg shadow-lg p-5'>
                                    <h3 className='font-bold text-lg mb-2'>{hotelInfo.name}</h3>
                                    <p className='text-sm text-gray-600'>{hotelInfo.location || hotelInfo.address}</p>
                                    {hotelInfo.star_rating > 0 && (
                                        <div className='flex gap-1 mt-2'>
                                            {[...Array(hotelInfo.star_rating)].map((_, i) => (
                                                <span key={i} className='text-yellow-500'>★</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Booking Details */}
                            <div className='bg-white rounded-lg shadow-lg p-5'>
                                <h3 className='font-bold text-lg mb-4'>Booking Details</h3>
                                <div className='space-y-3 text-sm'>
                                    <div>
                                        <p className='text-gray-500'>Check-In</p>
                                        <p className='font-semibold'>{checkIn}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-500'>Check-Out</p>
                                        <p className='font-semibold'>{checkOut}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-500'>Duration</p>
                                        <p className='font-semibold'>{nights} night{nights > 1 ? 's' : ''}</p>
                                    </div>
                                    {rateName && (
                                        <div>
                                            <p className='text-gray-500'>Rate Type</p>
                                            <p className='font-semibold'>{rateName}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className='bg-white rounded-lg shadow-lg p-5'>
                                <h3 className='font-bold text-lg mb-4'>Price Details</h3>
                                <div className='space-y-2 text-sm'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>{formatRupiah(pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</span>
                                        <span className='font-semibold'>{formatRupiah(totalPrice)}</span>
                                    </div>
                                    <hr className='my-2' />
                                    <div className='flex justify-between text-lg font-bold'>
                                        <span>Total</span>
                                        <span className='text-primary'>{formatRupiah(totalPrice)}</span>
                                    </div>
                                </div>
                                <p className='text-xs text-gray-500 mt-3'>* Payment will be processed at the hotel</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
