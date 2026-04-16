'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { bookingAPI } from '../../../src/services/api';
import { Clock, Mail } from 'lucide-react';

function BookingPendingContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code') || '';
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (code) {
            bookingAPI.getByCode(code)
                .then((res) => {
                    setBooking(res.data.data);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [code]);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <span className='ml-2'>Loading booking details...</span>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4'>
            <div className='max-w-lg w-full bg-white rounded-lg shadow-lg p-8'>
                <div className='text-center mb-6'>
                    <Clock className='w-16 h-16 text-yellow-500 mx-auto mb-4' />
                    <h1 className='text-2xl font-bold text-gray-800'>Payment Pending</h1>
                    <p className='text-gray-600 mt-2'>
                        Your booking is waiting for payment. Please complete your payment to confirm the booking.
                    </p>
                </div>

                {booking && (
                    <div className='bg-gray-50 rounded-lg p-4 space-y-3 mb-6'>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Booking Code</span>
                            <span className='font-semibold'>{booking.booking_code || code}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Guest</span>
                            <span className='font-semibold'>{booking.guest_name}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Check In</span>
                            <span className='font-semibold'>{booking.check_in}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Check Out</span>
                            <span className='font-semibold'>{booking.check_out}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-600'>Status</span>
                            <span className='font-semibold text-yellow-600 capitalize'>{booking.status}</span>
                        </div>
                        <div className='border-t pt-3 flex justify-between'>
                            <span className='text-gray-600 font-semibold'>Total</span>
                            <span className='font-bold text-primary'>IDR {booking.total?.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
                    <div className='flex items-start gap-3'>
                        <Mail className='w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                        <p className='text-sm text-yellow-800'>
                            Please complete payment within 24 hours or your booking will be automatically cancelled.
                        </p>
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <Link
                        href='/my-bookings'
                        className='w-full bg-primary text-white py-3 text-center rounded-lg font-semibold hover:bg-blue-600 transition'>
                        View My Bookings
                    </Link>
                    <Link
                        href='/destination'
                        className='w-full bg-gray-100 text-gray-700 py-3 text-center rounded-lg font-semibold hover:bg-gray-200 transition'>
                        Browse More Hotels
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function BookingPendingPage() {
    return (
        <Suspense fallback={
            <div className='min-h-screen flex items-center justify-center'>
                <span className='ml-2'>Loading...</span>
            </div>
        }>
            <BookingPendingContent />
        </Suspense>
    );
}
