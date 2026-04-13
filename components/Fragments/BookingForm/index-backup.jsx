'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { bookingAPI, roomAPI, facilityAPI, paymentAPI, availabilityAPI, rateAPI } from '../../../src/services/api';
import { FcGoogle } from 'react-icons/fc';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import Carousel from '../../Elements/Carousel';

export default function BookingForm() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id;

    // Baca data dari URL query params
    const urlCheckIn = searchParams.get('checkIn') || '';
    const urlCheckOut = searchParams.get('checkOut') || '';
    const urlAdult = searchParams.get('adult') || '1';
    const urlChildren = searchParams.get('children') || '0';
    const urlRooms = searchParams.get('rooms') || '1';

    const [room, setRoom] = useState({});
    const [roomImage, setRoomImage] = useState([]);
    const [rates, setRates] = useState({});
    const [facility, setFacility] = useState([]);
    const [loading, setLoading] = useState(false);

    const [bookingData, setBookingData] = useState({
        checkIn: urlCheckIn,
        checkOut: urlCheckOut,
        adult: parseInt(urlAdult),
        children: parseInt(urlChildren),
        roomQuantity: parseInt(urlRooms),
    });

    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [error, setError] = useState('');
    const [availableRoom, setAvailableRoom] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    // Kalkulasi harga
    const [pricing, setPricing] = useState({
        baseRate: 0,
        nights: 0,
        subtotal: 0,
        discount: 0,
        discountAmount: 0,
        tax: 0,
        serviceCharge: 0,
        extraBed: 0,
        total: 0,
    });

    useEffect(() => {
        // Load room data
        roomAPI.byId(id)
            .then((res) => {
                setRoom(res.data);
                setRates(res.data);
                setLoading(true);
            })
            .catch((err) => {
                console.error('Failed to load room:', err);
                setLoading(false);
            });

        // Load room images
        roomAPI.imagesById(id)
            .then((res) => {
                setRoomImage(res.data);
            })
            .catch(() => setRoomImage([]));

        // Load facilities
        facilityAPI.roomFacilities(id)
            .then((res) => {
                const data = JSON.parse(res.data.facility_name || '[]');
                setFacility(data.join(', '));
            })
            .catch(() => setFacility(''));
    }, [id]);

    // Hitung jumlah malam dan kalkulasi harga saat checkIn/checkOut berubah
    useEffect(() => {
        if (bookingData.checkIn && bookingData.checkOut && rates.rate) {
            const checkInDate = new Date(bookingData.checkIn);
            const checkOutDate = new Date(bookingData.checkOut);
            
            // Hitung jumlah malam
            const diffTime = Math.abs(checkOutDate - checkInDate);
            const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (nights > 0) {
                const baseRate = parseFloat(rates.rate) || 0;
                const subtotal = baseRate * bookingData.roomQuantity * nights;
                
                // Default tax 11% dan service charge 5%
                const taxRate = 0.11;
                const serviceRate = 0.05;
                const tax = subtotal * taxRate;
                const serviceCharge = subtotal * serviceRate;
                
                const total = subtotal + tax + serviceCharge;
                
                setPricing({
                    baseRate,
                    nights,
                    subtotal,
                    discount: 0,
                    discountAmount: 0,
                    tax,
                    serviceCharge,
                    extraBed: 0,
                    total,
                });
            }
        }
    }, [bookingData.checkIn, bookingData.checkOut, bookingData.roomQuantity, rates.rate]);

    // Handle payment after booking is created
    const handlePayment = async (bookingId, amount, formData) => {
        setPaymentProcessing(true);
        try {
            // Try new Snap endpoint first
            const response = await paymentAPI.createSnap({
                booking_id: bookingId,
            });

            const { token, redirect_url } = response.data.data;

            // Call Midtrans Snap
            if (window.snap) {
                window.snap.pay(token, {
                    onSuccess: (result) => {
                        console.log('Payment Success:', result);
                        router.push(`/booking/success?code=NAJ${bookingId}`);
                    },
                    onPending: (result) => {
                        console.log('Payment Pending:', result);
                        router.push(`/booking/pending?code=NAJ${bookingId}`);
                    },
                    onError: (result) => {
                        console.log('Payment Error:', result);
                        alert('Payment failed. Please try again.');
                    },
                    onClose: () => {
                        // User closed payment popup - still show invoice
                        setPaymentProcessing(false);
                    },
                });
            } else {
                // Fallback: redirect to Midtrans redirect URL
                window.location.href = redirect_url;
            }
        } catch (err) {
            console.error('Payment error:', err);
            // Fallback to legacy payment endpoint
            try {
                const response = await paymentAPI.createLegacy({
                    gross_amount: amount,
                    fullname: formData.fullname,
                    email: formData.email,
                    mobile_number: formData.mobileNumber,
                });

                const token = response.data.token;
                if (window.snap && token) {
                    window.snap.pay(token, {
                        onSuccess: () => router.push(`/booking/success?code=NAJ${bookingId}`),
                        onPending: () => router.push(`/booking/pending?code=NAJ${bookingId}`),
                        onError: () => alert('Payment failed'),
                        onClose: () => setPaymentProcessing(false),
                    });
                } else {
                    // If Midtrans not available, just show invoice
                    setPaymentProcessing(false);
                }
            } catch (legacyErr) {
                console.error('Legacy payment error:', legacyErr);
                setPaymentProcessing(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        // Validasi tanggal
        if (!bookingData.checkIn || !bookingData.checkOut) {
            setError('Please select check-in and check-out dates');
            setSubmitting(false);
            return;
        }

        // Availability check sebelum booking
        setCheckingAvailability(true);
        try {
            const availabilityResponse = await availabilityAPI.check({
                check_in: bookingData.checkIn,
                check_out: bookingData.checkOut,
                room_id: room.id || rates.room?.id,
                adult: bookingData.adult,
                children: bookingData.children,
                rooms: bookingData.roomQuantity,
            });

            if (!availabilityResponse.data.success || !availabilityResponse.data.available) {
                setError('Room is not available for the selected dates. Please choose different dates or room.');
                setSubmitting(false);
                setCheckingAvailability(false);
                return;
            }

            setAvailableRoom(availabilityResponse.data.room);
        } catch (availErr) {
            console.error('Availability check error:', availErr);
            setError('Failed to check room availability. Please try again.');
            setSubmitting(false);
            setCheckingAvailability(false);
            return;
        }
        setCheckingAvailability(false);

        const form = e.target;
        const payload = {
            room_id: room.id || rates.room?.id,
            subroom_id: availableRoom?.subroom_id || null,
            title: form.title.value,
            fullname: form.fullname.value,
            email: form.email.value,
            mobile_number: form.mobileNumber.value,
            special_request: form.specialRequest.value,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            adult: bookingData.adult,
            children: bookingData.children,
            roomQuantity: bookingData.roomQuantity,
            total: pricing.total,
            base_rate: pricing.baseRate,
            nights: pricing.nights,
            tax: pricing.tax,
            service_charge: pricing.serviceCharge,
            discount_amount: pricing.discountAmount,
        };

        try {
            // Create booking
            const response = await bookingAPI.create(payload);
            const booking = response.data.booking;

            setInvoiceData(booking);
            setShowInvoice(true);

            // After booking success, initiate payment
            await handlePayment(
                parseInt(booking.invoice_number.replace('NAJ', '')),
                pricing.total,
                form
            );
        } catch (err) {
            console.error('Booking error:', err);
            if (err.response?.status === 422) {
                const errors = Object.values(err.response.data.errors)[0];
                setError(errors ? errors[0] : 'Validation error');
            } else {
                setError('Failed to create booking. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    function getDayName(dateString) {
        if (!dateString || typeof dateString !== 'string') return 'Invalid Date';
        const dateObject = new Date(dateString);
        if (isNaN(dateObject.getTime())) return 'Invalid Date';
        const options = { weekday: 'long' };
        return new Intl.DateTimeFormat('id-ID', options).format(dateObject);
    }

    const formatRupiah = (num) => 'IDR ' + num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (!loading) return <div className='min-h-screen flex items-center justify-center'>Loading...</div>;

    return (
        <div className='min-h-screen bg-gray-100 flex justify-center py-6 px-3'>
            <div className='w-full max-w-5xl bg-white shadow-lg overflow-hidden'>
                {/* Header */}
                <div className='bg-primary text-white p-5 text-center text-xl font-semibold'>
                    Your Accommodation Booking
                </div>

                {error && (
                    <div className='mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm'>
                        {error}
                    </div>
                )}

                <div className='flex flex-col justify-center items-start px-6 py-4'>
                    <h5 className='text-lg mb-2'>Login dengan : </h5>
                    <div className='flex gap-4'>
                        <Link href='/login' className='w-32 h-10 flex items-center justify-center border'>
                            <span className='me-2'>Login</span>
                            <FaUserCircle className='text-xl' />
                        </Link>
                        <a className='w-32 h-10 flex items-center justify-center border' href='http://10.108.118.71:8000/api/auth/google/redirect'>
                            <span className='me-2'>Google</span> <FcGoogle className='text-xl' />
                        </a>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className='grid md:grid-cols-3 gap-6 px-6'>
                    <input type='hidden' name='total' value={rates.rate} />

                    {/* Left Content */}
                    <div className='md:col-span-2 space-y-6'>
                        {/* Contact Details */}
                        <div className='border p-5 space-y-4 shadow-sm'>
                            <h2 className='font-semibold text-lg'>Contact Details</h2>
                            <div className='grid md:grid-cols-2 gap-4'>
                                <select name='title' className='border p-2'>
                                    <option>Mr.</option>
                                    <option>Mrs.</option>
                                    <option>Ms.</option>
                                </select>
                                <input required name='fullname' type='text' placeholder='Full Name' className='border p-2' />
                                <input required name='email' type='email' placeholder='Email Address' className='border p-2 col-span-2' />
                                <div className='flex col-span-2 gap-2'>
                                    <select className='border p-2 w-28'>
                                        <option>+62</option>
                                        <option>+60</option>
                                        <option>+65</option>
                                    </select>
                                    <input required name='mobileNumber' type='tel' placeholder='Mobile Number' className='border p-2 flex-1' />
                                </div>
                            </div>

                            <div className='flex gap-4'>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='font-semibold mb-1' htmlFor='checkIn'>Check In</label>
                                    <input type='date' name='checkIn' id='checkIn' defaultValue={bookingData.checkIn} className='border p-2' required />
                                </div>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='font-semibold mb-1' htmlFor='checkOut'>Check Out</label>
                                    <input type='date' name='checkOut' id='checkOut' defaultValue={bookingData.checkOut} className='border p-2' required />
                                </div>
                            </div>
                        </div>

                        {/* Stay Details */}
                        <div className='border p-5 shadow-sm space-y-4'>
                            <h2 className='font-semibold text-lg'>Stay Details at {rates.room?.hotel?.name || 'NAJJ Hotel'}</h2>
                            <p className='text-sm text-gray-500'>For smoother check-in, enter the guest&apos;s name as written on ID card.</p>

                            <div className='space-y-2'>
                                <p className='font-medium'>{rates.plan || 'Room Only'}</p>
                                <ul className='list-disc ml-5 text-sm text-gray-600 space-y-1'>
                                    <li>{bookingData.roomQuantity} Room</li>
                                    <li>{rates.room?.capacity || '-'} Guest</li>
                                    <li>{bookingData.adult || 1} Adult</li>
                                    <li>{bookingData.children || 0} Children</li>
                                    {facility && <li>{facility}</li>}
                                    {!rates.smoking_policy && <li>Non-Smoking Room</li>}
                                </ul>
                            </div>

                            <textarea name='specialRequest' className='border p-2 w-full' placeholder='Any special requests or needs?' rows={3} />
                        </div>

                        {/* Policy */}
                        <div className='border p-5 shadow-sm'>
                            <h2 className='font-semibold text-lg'>Cancellation Policy</h2>
                            <p className='text-sm text-gray-600'>
                                Refund and reschedule not allowed. If you don&apos;t arrive on check-in date, it will be considered no-show.
                            </p>
                        </div>

                        <div className='border p-5 shadow-sm'>
                            <h2 className='font-semibold text-lg'>Accommodation Policies</h2>
                            <div className='flex justify-between text-sm text-gray-700 mt-2'>
                                <p>Check-In: <span className='font-medium'>{bookingData.checkIn}</span></p>
                                <p>Check-Out: <span className='font-medium'>{bookingData.checkOut}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className='space-y-6'>
                        {/* Booking Summary */}
                        <div className='border shadow-sm overflow-hidden'>
                            <Carousel height={'68'} images={roomImage} name={rates.room?.name || 'Room'} />
                            <div className='p-4 space-y-2'>
                                <h3 className='font-semibold'>{rates.room?.name || 'Room'}</h3>
                                <p className='text-sm text-gray-600'>
                                    {getDayName(bookingData.checkIn)} {bookingData.checkIn}
                                    <span className='mx-1'>/</span>
                                    {getDayName(bookingData.checkOut)} {bookingData.checkOut}
                                    <br />1 Night • {bookingData.roomQuantity} Room • {rates.room?.capacity || '-'} Guest
                                </p>
                                <p className='text-right font-bold text-primary'>{formatRupiah(rates.rate * bookingData.roomQuantity)}</p>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className='border p-4 shadow-sm space-y-2'>
                            <h2 className='font-semibold text-lg'>Apply Coupons</h2>
                            <div className='flex gap-2'>
                                <input type='text' placeholder='Enter coupon' className='border p-2 flex-1' />
                                <button type='button' className='bg-primary text-white px-4 hover:bg-blue-600'>Apply</button>
                            </div>
                        </div>

                        {/* Total */}
                        <div className='border p-4 shadow-sm space-y-4'>
                            <div className='flex justify-between text-lg font-semibold'>
                                <span>Total</span>
                                <span className='text-primary'>{formatRupiah(rates.rate * bookingData.roomQuantity)}</span>
                            </div>
                            <button
                                type='submit'
                                disabled={submitting || paymentProcessing}
                                className='w-full bg-primary text-white py-3 text-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed'>
                                {submitting ? 'Processing...' : paymentProcessing ? 'Opening Payment...' : 'Continue To Payment'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Invoice Modal */}
            {showInvoice && invoiceData && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <div className='bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto relative'>
                        <button
                            className='absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl'
                            onClick={() => setShowInvoice(false)}>
                            ✕
                        </button>

                        <h2 className='text-2xl font-bold text-center mb-4'>Invoice</h2>
                        <div className='space-y-2 text-sm'>
                            <p><strong>Invoice Number:</strong> {invoiceData.invoice_number}</p>
                            <p><strong>Nama:</strong> {invoiceData.fullname}</p>
                            <p><strong>Email:</strong> {invoiceData.email}</p>
                            <p><strong>Check In:</strong> {invoiceData.check_in}</p>
                            <p><strong>Check Out:</strong> {invoiceData.check_out}</p>
                            <p><strong>Special Request:</strong> {invoiceData.special_request || '-'}</p>
                            <p><strong>Total:</strong> IDR {Number(invoiceData.total).toLocaleString()}</p>
                        </div>

                        <div className='text-center mt-4 space-y-2'>
                            {paymentProcessing && (
                                <p className='text-sm text-blue-600'>Opening payment gateway...</p>
                            )}
                            <button
                                className='w-full bg-primary text-white px-4 py-2 rounded hover:bg-blue-600'
                                onClick={() => setShowInvoice(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
