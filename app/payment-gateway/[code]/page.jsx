'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Fragments/Navbar';
import Footer from '../../../components/Fragments/Footer';
import { bookingAPI } from '../../../src/services/api';
import { useAuth } from '../../../src/context/AuthContext';
import { CreditCard, ArrowLeft, Clock } from 'lucide-react';

export default function PaymentGatewayPage() {
    const { code } = useParams();
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(`/payment-gateway/${code}`)}`);
            return;
        }

        if (isAuthenticated && code) {
            bookingAPI
                .getByCode(code)
                .then((res) => {
                    setBooking(res.data.data || null);
                })
                .catch(() => {
                    setError('Booking tidak ditemukan.');
                });
        }
    }, [code, isAuthenticated, loading, router]);

    const formatRupiah = (num) => {
        return 'IDR ' + Number(num || 0).toLocaleString('id-ID');
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-3xl mx-auto px-4 py-10'>
                <Link href='/my-bookings' className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6'>
                    <ArrowLeft className='w-4 h-4' />
                    Back to My Bookings
                </Link>

                <div className='bg-white rounded-xl shadow-sm border p-6'>
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='p-3 rounded-full bg-blue-100 text-blue-700'>
                            <CreditCard className='w-6 h-6' />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>Payment Gateway</h1>
                            <p className='text-sm text-gray-500'>Halaman pembayaran sedang disiapkan.</p>
                        </div>
                    </div>

                    {error && <p className='text-sm text-red-600 mb-4'>{error}</p>}

                    <div className='rounded-lg border bg-gray-50 p-4 mb-6'>
                        <p className='text-sm text-gray-500'>Booking Code</p>
                        <p className='text-lg font-semibold text-gray-900'>{booking?.booking_code || code}</p>
                        <p className='text-sm text-gray-500 mt-2'>Total Reservasi</p>
                        <p className='text-xl font-bold text-blue-700'>{formatRupiah(booking?.total)}</p>
                    </div>

                    <div className='flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
                        <Clock className='w-5 h-5 text-yellow-700 mt-0.5' />
                        <p className='text-sm text-yellow-800'>
                            Integrasi metode pembayaran sedang dalam tahap finalisasi. Reservasi kamu sudah tersimpan dan bisa dilihat di halaman My Bookings.
                        </p>
                    </div>

                    <div className='flex gap-3'>
                        <Link
                            href='/my-bookings'
                            className='flex-1 text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition'>
                            Lihat My Bookings
                        </Link>
                        <Link
                            href='/hotels'
                            className='flex-1 text-center bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition'>
                            Cari Hotel Lagi
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
