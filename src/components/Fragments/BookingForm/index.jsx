'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import Carousel from '../../Elements/Carousel';
import { roomAPI, facilityAPI, bookingAPI, paymentAPI } from '../../../services/api';

export default function BookingForm() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id;
    const [room, setRoom] = useState({});
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [roomImage, setRoomImage] = useState([]);
    const [rates, setRates] = useState({});
    const [facility, setFacility] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        adult: 0,
        children: 0,
        roomQuantity: 1,
    });
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);

    // Note: In Next.js, we can't access location.state from React Router
    // We'll use searchParams instead
    const bookingUrl = {
        checkIn: searchParams.get('checkIn') || '',
        checkOut: searchParams.get('checkOut') || '',
        adult: searchParams.get('adult') || 0,
        children: searchParams.get('children') || 0,
        roomQuantity: searchParams.get('roomQuantity') || 1,
    };


    useEffect(() => {
        roomAPI.byId(id)
            .then((res) => {
                setRoom(res.data);
            })
            .catch(() => {});
    }, [id]);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     axios
    //         .post('http://127.0.0.1:8000/api/post/booking', {
    //             room_id: room.id,
    //             title: e.target.title.value,
    //             fullname: e.target.fullname.value,
    //             email: e.target.email.value,
    //             mobile_number: e.target.mobileNumber.value,
    //             special_request: e.target.specialRequest.value,
    //         })
    //         .catch((err) => console.error(err));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target.checkIn.value)
        try {
            const res = await bookingAPI.createLegacy({
                room_id: room.id,
                title: e.target.title.value,
                fullname: e.target.fullname.value,
                email: e.target.email.value,
                mobile_number: e.target.mobileNumber.value,
                special_request: e.target.specialRequest.value,
                checkIn: e.target.checkIn.value,
                checkOut: e.target.checkOut.value,
                total: rates.rate * bookingData.roomQuantity
            });
            console.log(res.data)
            setInvoiceData(res.data.booking); // simpan data invoice
            setShowInvoice(true); // tampilkan popup
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogin = async (credentialResponse) => {
        try {
            // kirim credential (token google) ke backend
            const res = await axios.post('http://localhost:8000/api/auth/google/callback', {
                token: credentialResponse.credential,
            });

            localStorage.setItem('token', res.data.token);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckIn = (e) => {
        setCheckIn(e.target.value);
    };

    const handleCheckOut = (e) => {
        setCheckOut(e.target.value);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        const form = e.target;

        try {
            const res = await paymentAPI.createLegacy({
                gross_amount: rates.rate,
                fullname: form.fullname.value,
                email: form.email.value,
                mobile_number: form.mobileNumber.value,
                special_request: form.specialRequest.value,
            });

            const token = res.data.token;

            // Panggil Midtrans Snap
            window.snap.pay(token, {
                onSuccess: (result) => {
                    console.log('Success:', result);
                },
                onPending: (result) => {
                    console.log('Pending:', result);
                },
                onError: (result) => {
                    console.log('Error:', result);
                },
                onClose: () => {
                    alert('Payment popup closed');
                },
            });
        } catch (err) {
            console.error(err);
        }
    };

    function getDayName(dateString) {
        // Pastikan input adalah string dalam format YYYY-MM-DD
        if (!dateString || typeof dateString !== 'string') {
            return 'Invalid Date';
        }

        // Buat objek Date dari string
        const dateObject = new Date(dateString);

        // Jika tanggal tidak valid (misal: '2025-02-30')
        if (isNaN(dateObject.getTime())) {
            return 'Invalid Date';
        }

        // Opsi untuk nama hari panjang
        const options = { weekday: 'long' };

        // Dapatkan nama hari dalam bahasa Indonesia
        const dayName = new Intl.DateTimeFormat('id-ID', options).format(dateObject);

        return dayName;
    }

    useEffect(() => {
        roomAPI.imagesById(id)
            .then((res) => {
                setRoomImage(res.data);
            })
            .catch(() => {});
    }, [id]);

    useEffect(() => {
        // Update booking data with URL search params
        setBookingData({
            checkIn: bookingUrl.checkIn,
            checkOut: bookingUrl.checkOut,
            adult: bookingUrl.adult,
            children: bookingUrl.children,
            roomQuantity: bookingUrl.roomQuantity,
        });

        setCheckIn(bookingUrl.checkIn);
        setCheckOut(bookingUrl.checkOut);
    }, []);

    useEffect(() => {
        roomAPI.byId(id)
            .then((res) => {
                setRates(res.data);
                setLoading(true);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        facilityAPI.roomFacilities(id)
            .then((res) => {
                const datas = JSON.parse(res.data.facility_name);
                setFacility(datas.join(', '));
            })
            .catch((err) => console.error(err));
    }, [id]);

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (!loading) return <p>Loading..</p>;

    return (
        <div className='min-h-screen bg-gray-100 flex justify-center py-6 px-3'>
            <div className='w-full max-w-5xl bg-white shadow-lg overflow-hidden'>
                {/* Header */}
                <div className='bg-primary text-white p-5 text-center text-xl font-semibold'>Your Accommodation Booking</div>

                <div className='flex flex-col justify-center items-start px-6 py-4'>
                    <h5 className='text-lg mb-2'>Login dengan : </h5>
                    <div className='flex gap-4'>
                        <Link href='/login' className='w-32 h-10 flex items-center justify-center border'>
                            <span className='me-2'>Login</span>
                            <FaUserCircle className='text-xl' />{' '}
                        </Link>
                        <a className='w-32 h-10 flex items-center justify-center border' href={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'}/auth/google/redirect`}>
                            <span className='me-2'>Google</span> <FcGoogle className='text-xl' />{' '}
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
                                <div required className='flex col-span-2 gap-2'>
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
                                    <label className='font-semibold mb-1' htmlFor='checkIn'>
                                        Check In
                                    </label>
                                    <input onChange={handleCheckIn} value={checkIn} type='date' name='checkIn' id='checkIn' className='border p-2' />
                                </div>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='font-semibold mb-1' htmlFor='checkOut'>
                                        Check Out
                                    </label>
                                    <input
                                        onChange={handleCheckOut}
                                        value={bookingData.checkOut}
                                        type='date'
                                        name='checkOut'
                                        id='checkOut'
                                        className='border p-2'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stay Details */}
                        <div className='border p-5 shadow-sm space-y-4'>
                            <h2 className='font-semibold text-lg'>Stay Details at {`${rates.room.hotel.name}`}</h2>
                            <p className='text-sm text-gray-500'>For smoother check-in, enter the guest’s name as written on ID card.</p>

                            <div className='space-y-2'>
                                <p className='font-medium'>{rates.plan}</p>
                                <ul className='list-disc ml-5 text-sm text-gray-600 space-y-1'>
                                    <li>{`${bookingData.roomQuantity}`} Room</li>
                                    <li>{`${rates.room.capacity}`} Guest</li>
                                    <li>{`${bookingData.adult}`} Adult</li>
                                    <li>{`${bookingData.children}`} Children</li>
                                    <li>{facility ? facility : 'None'}</li>
                                    {!rates.smoking_policy && <li>Non-Smoking Room</li>}
                                </ul>
                            </div>

                            <textarea name='specialRequest' className='border p-2 w-full' placeholder='Any special requests or needs?' rows={3} />
                        </div>

                        {/* Policy */}
                        <div className='border p-5 shadow-sm'>
                            <h2 className='font-semibold text-lg'>Cancellation Policy</h2>
                            <p className='text-sm text-gray-600'>
                                Refund and reschedule not allowed. If you don’t arrive on check-in date, it will be consideblue no-show.
                            </p>
                        </div>

                        <div className='border p-5 shadow-sm'>
                            <h2 className='font-semibold text-lg'>Accommodation Policies</h2>
                            <div className='flex justify-between text-sm text-gray-700 mt-2'>
                                <p>
                                    Check-In: <span className='font-medium'>{bookingData.checkIn}</span>
                                </p>
                                <p>
                                    Check-Out: <span className='font-medium'>{bookingData.checkOut}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className='space-y-6'>
                        {/* Booking Summary */}
                        <div className='border shadow-sm overflow-hidden'>
                            {/* Ganti img jadi Carousel */}
                            <Carousel height={'68'} images={roomImage} name={rates.room.name} />

                            <div className='p-4 space-y-2'>
                                <h3 className='font-semibold'>{rates.room.name}</h3>
                                <p className='text-sm text-gray-600'>
                                    {getDayName(bookingData.checkIn)} {bookingData.checkIn}
                                    <span className='mx-1'>/</span>
                                    {getDayName(bookingData.checkOut)} {bookingData.checkOut} <br />1 Night • {bookingData.roomQuantity} Room • {rates.room.capacity} Guest
                                </p>
                                <p className='text-right font-bold text-primary'>{formatRupiah(rates.rate * bookingData.roomQuantity)}</p>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className='border p-4 shadow-sm space-y-2'>
                            <h2 className='font-semibold text-lg'>Apply Coupons</h2>
                            <div className='flex gap-2'>
                                <input type='text' placeholder='Enter coupon' className='border p-2 flex-1' />
                                <button className='bg-primary text-white px-4 hover:bg-blue-600'>Apply</button>
                            </div>
                        </div>

                        {/* Total */}
                        <div className='border p-4 shadow-sm space-y-4'>
                            <div className='flex justify-between text-lg font-semibold'>
                                <span>Total</span>
                                <span className='text-primary'>{formatRupiah(rates.rate * bookingData.roomQuantity)}</span>
                            </div>
                            <button type='submit' className='w-full bg-primary text-white py-3 text-lg font-semibold hover:bg-blue-600 transition'>
                                Continue To Payment
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {showInvoice && invoiceData && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <div className='bg-white rounded-lg shadow-lg p-6 w-[500px] relative'>
                        <button className='absolute top-2 right-2 text-gray-600 hover:text-red-500' onClick={() => setShowInvoice(false)}>
                            ✕
                        </button>

                        <h2 className='text-2xl font-bold text-center mb-4'>Invoice</h2>
                        <p>
                            <strong>Invoice Number:</strong> {invoiceData.invoice_number}
                        </p>
                        <p>
                            <strong>Nama:</strong> {invoiceData.fullname}
                        </p>
                        <p>
                            <strong>Email:</strong> {invoiceData.email}
                        </p>
                        <p>
                            <strong>Check In:</strong> {invoiceData.check_in}
                        </p>
                        <p>
                            <strong>Check Out:</strong> {invoiceData.check_out}
                        </p>
                        <p>
                            <strong>Special Request:</strong> {invoiceData.special_request || '-'}
                        </p>
                        <p>
                            <strong>Total:</strong> IDR {Number(invoiceData.total).toLocaleString()}
                        </p>

                        <div className='text-center mt-4'>
                            <button className='bg-primary text-white px-4 py-2 rounded hover:bg-blue-600' onClick={() => setShowInvoice(false)}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
