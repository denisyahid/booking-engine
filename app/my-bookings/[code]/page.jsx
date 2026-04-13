'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { bookingAPI, paymentAPI } from '../../../src/services/api';
import Navbar from '../../../components/Fragments/Navbar/index';
import Footer from '../../../components/Fragments/Footer';
import Link from 'next/link';
import { Calendar, Mail, Phone, User, FileText, CreditCard, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const code = params.code;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        if (!code) return;

        bookingAPI.getByCode(code)
            .then((res) => {
                setBooking(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load booking:', err);
                setError('Booking not found or invalid booking code');
                setLoading(false);
            });
    }, [code]);

    const handlePayNow = async () => {
        setProcessingPayment(true);
        try {
            const bookingId = booking.invoice_number?.replace('NAJ', '');
            const response = await paymentAPI.createSnap({ booking_id: bookingId });
            const { token, redirect_url } = response.data.data;

            if (window.snap) {
                window.snap.pay(token, {
                    onSuccess: (result) => {
                        console.log('Payment Success:', result);
                        window.location.reload();
                    },
                    onPending: (result) => {
                        console.log('Payment Pending:', result);
                        window.location.reload();
                    },
                    onError: (result) => {
                        console.log('Payment Error:', result);
                        alert('Payment failed. Please try again.');
                        setProcessingPayment(false);
                    },
                    onClose: () => {
                        setProcessingPayment(false);
                    },
                });
            } else {
                window.location.href = redirect_url;
            }
        } catch (err) {
            console.error('Payment error:', err);
            alert('Failed to initiate payment. Please try again.');
            setProcessingPayment(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatRupiah = (num) => {
        if (!num) return 'IDR 0';
        return 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            confirmed: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Confirmed' },
            pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Pending' },
            cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
            completed: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Completed' },
            'checked-in': { color: 'bg-purple-100 text-purple-700', icon: CheckCircle, label: 'Checked In' },
            'checked-out': { color: 'bg-gray-100 text-gray-700', icon: CheckCircle, label: 'Checked Out' },
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-700', icon: Clock, label: status };
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <Icon className="w-4 h-4" />
                {config.label}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            paid: { color: 'bg-green-100 text-green-700', label: 'Paid' },
            pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending Payment' },
            unpaid: { color: 'bg-red-100 text-red-700', label: 'Unpaid' },
            refunded: { color: 'bg-blue-100 text-blue-700', label: 'Refunded' },
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-700', label: status };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <Navbar />
                <div className='flex items-center justify-center min-h-[60vh]'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                        <p className='text-gray-600'>Loading booking details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <Navbar />
                <div className='max-w-4xl mx-auto px-4 py-16'>
                    <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
                        <XCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Booking Not Found</h2>
                        <p className='text-gray-600 mb-6'>{error || 'The booking you are looking for does not exist'}</p>
                        <Link
                            href='/my-bookings'
                            className='inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition'>
                            <ArrowLeft className='w-4 h-4' />
                            Back to My Bookings
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />

            <div className='max-w-5xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='mb-8'>
                    <Link href='/my-bookings' className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4'>
                        <ArrowLeft className='w-4 h-4' />
                        Back to My Bookings
                    </Link>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Booking Details</h1>
                            <p className='text-gray-600'>Invoice: {booking.invoice_number}</p>
                        </div>
                        <div className='flex gap-2'>
                            {getStatusBadge(booking.status)}
                            {booking.payment_status && getPaymentStatusBadge(booking.payment_status)}
                        </div>
                    </div>
                </div>

                <div className='grid md:grid-cols-3 gap-6'>
                    {/* Main Content */}
                    <div className='md:col-span-2 space-y-6'>
                        {/* Guest Information */}
                        <div className='bg-white rounded-lg shadow-sm p-6'>
                            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                                <User className='w-5 h-5' />
                                Guest Information
                            </h2>
                            <div className='space-y-3'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <p className='text-sm text-gray-500'>Title</p>
                                        <p className='font-medium'>{booking.title || '-'}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500'>Full Name</p>
                                        <p className='font-medium'>{booking.fullname}</p>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex items-center gap-2'>
                                        <Mail className='w-4 h-4 text-gray-400' />
                                        <div>
                                            <p className='text-sm text-gray-500'>Email</p>
                                            <p className='font-medium'>{booking.email}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Phone className='w-4 h-4 text-gray-400' />
                                        <div>
                                            <p className='text-sm text-gray-500'>Phone</p>
                                            <p className='font-medium'>{booking.mobile_number || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className='bg-white rounded-lg shadow-sm p-6'>
                            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                                <Calendar className='w-5 h-5' />
                                Booking Details
                            </h2>
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <p className='text-sm text-gray-500'>Check-In</p>
                                        <p className='font-medium'>{formatDate(booking.check_in)}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500'>Check-Out</p>
                                        <p className='font-medium'>{formatDate(booking.check_out)}</p>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <p className='text-sm text-gray-500'>Room Type</p>
                                        <p className='font-medium'>{booking.room?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500'>Room Quantity</p>
                                        <p className='font-medium'>{booking.room_quantity || 1}</p>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <p className='text-sm text-gray-500'>Adults</p>
                                        <p className='font-medium'>{booking.adult || 1}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-gray-500'>Children</p>
                                        <p className='font-medium'>{booking.children || 0}</p>
                                    </div>
                                </div>
                                {booking.special_request && (
                                    <div>
                                        <p className='text-sm text-gray-500 mb-1'>Special Request</p>
                                        <p className='font-medium bg-gray-50 p-3 rounded'>{booking.special_request}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        {booking.payment_status === 'pending' || booking.payment_status === 'unpaid' ? (
                            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
                                <h2 className='text-xl font-semibold mb-4 text-yellow-800'>Payment Required</h2>
                                <p className='text-yellow-700 mb-4'>
                                    Your booking is waiting for payment. Please complete the payment to confirm your reservation.
                                </p>
                                <button
                                    onClick={handlePayNow}
                                    disabled={processingPayment}
                                    className='w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50'>
                                    {processingPayment ? 'Processing...' : 'Pay Now'}
                                </button>
                            </div>
                        ) : booking.payment_status === 'paid' ? (
                            <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
                                <h2 className='text-xl font-semibold mb-2 text-green-800'>Payment Completed</h2>
                                <p className='text-green-700'>
                                    Your payment has been received. Your booking is confirmed.
                                </p>
                            </div>
                        ) : null}
                    </div>

                    {/* Sidebar */}
                    <div className='space-y-6'>
                        {/* Payment Summary */}
                        <div className='bg-white rounded-lg shadow-sm p-6'>
                            <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                                <CreditCard className='w-5 h-5' />
                                Payment Summary
                            </h2>
                            <div className='space-y-3'>
                                <div className='flex justify-between text-sm'>
                                    <span className='text-gray-500'>Base Rate</span>
                                    <span className='font-medium'>{formatRupiah(booking.base_rate || booking.total)}</span>
                                </div>
                                {booking.nights && (
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-gray-500'>Nights</span>
                                        <span className='font-medium'>{booking.nights}</span>
                                    </div>
                                )}
                                {booking.tax && (
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-gray-500'>Tax (11%)</span>
                                        <span className='font-medium'>{formatRupiah(booking.tax)}</span>
                                    </div>
                                )}
                                {booking.service_charge && (
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-gray-500'>Service Charge</span>
                                        <span className='font-medium'>{formatRupiah(booking.service_charge)}</span>
                                    </div>
                                )}
                                {booking.discount_amount > 0 && (
                                    <div className='flex justify-between text-sm text-green-600'>
                                        <span>Discount</span>
                                        <span>- {formatRupiah(booking.discount_amount)}</span>
                                    </div>
                                )}
                                <hr className='my-2' />
                                <div className='flex justify-between text-lg font-bold'>
                                    <span>Total</span>
                                    <span className='text-blue-600'>{formatRupiah(booking.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className='bg-white rounded-lg shadow-sm p-6'>
                            <h2 className='text-lg font-semibold mb-4'>Quick Actions</h2>
                            <div className='space-y-2'>
                                <Link
                                    href='/my-bookings'
                                    className='block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition'>
                                    View All Bookings
                                </Link>
                                {booking.status === 'pending' && (
                                    <Link
                                        href='/hotels'
                                        className='block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>
                                        Book Another Room
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
