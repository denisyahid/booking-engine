import React, { useEffect, useState } from 'react';
import { data, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

export default function BookingForm() {
    // const [guestType, setGuestType] = useState('self');
    const [room, setRoom] = useState({});
    const [rates, setRates] = useState({});
    const [facility, setFacility] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        adult: 0,
        children: 0,
    });
    const { id } = useParams();
    const location = useLocation();
    const bookingUrl = location.state || {};

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post('http://127.0.0.1:8000/api/post/booking', {
                room_id: room.id,
                title: e.target.title.value,
                fullname: e.target.fullname.value,
                email: e.target.email.value,
                mobile_number: e.target.mobileNumber.value,
                special_request: e.target.specialRequest.value,
            })
            .then((res) => console.log(res.data))
            .catch((err) => console.error(err));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        const form = e.target;

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/payment', {
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
        const params = new URLSearchParams(location.search);

        // Memperbarui state dengan nilai dari URL
        setBookingData({
            checkIn: bookingUrl.checkIn,
            checkOut: bookingUrl.checkOut,
            adult: bookingUrl.adult,
            children: bookingUrl.children,
        });
    }, [location.search]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/room/${id}`).then((res) => {
            setRates(res.data);
            setLoading(true);
        });
    }, []);

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/facilities/${id}`)
            .then((res) => {
                const datas = JSON.parse(res.data.facility_name);
                console.log(datas);
                setFacility(datas.join(', '));
            })
            .catch((err) => console.error(err));
    }, []);

    // useEffect(() => {
    //     axios.get(`http://127.0.0.1:8000/api/rate/${bookingUrl.bookingId}`).then((res) => {
    //         setRates(res.data);
    //     });
    // }, []);

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (!loading) return <p>Loading..</p>;

    return (
        <div className='min-h-screen bg-gray-100 flex justify-center py-6 px-3'>
            <div className='w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden'>
                {/* Header */}
                <div className='bg-blue-800 text-white p-5 text-center text-xl font-semibold'>Your Accommodation Booking</div>

                {/* Content */}
                <form onSubmit={handlePayment} className='grid md:grid-cols-3 gap-6 p-6'>
                    <input type='hidden' name='total' value={rates.rate} />
                    {/* Left Content */}
                    <div className='md:col-span-2 space-y-6'>
                        {/* Contact Details */}
                        <div className='border rounded-xl p-5 space-y-4 shadow-sm'>
                            <h2 className='font-semibold text-lg'>Contact Details</h2>
                            <div className='grid md:grid-cols-2 gap-4'>
                                <select name='title' className='border rounded-lg p-2'>
                                    <option>Mr.</option>
                                    <option>Mrs.</option>
                                    <option>Ms.</option>
                                </select>
                                <input name='fullname' type='text' placeholder='Full Name' className='border rounded-lg p-2' />
                                <input name='email' type='email' placeholder='Email Address' className='border rounded-lg p-2 col-span-2' />
                                <div className='flex col-span-2 gap-2'>
                                    <select className='border rounded-lg p-2 w-28'>
                                        <option>+62</option>
                                        <option>+60</option>
                                        <option>+65</option>
                                    </select>
                                    <input name='mobileNumber' type='tel' placeholder='Mobile Number' className='border rounded-lg p-2 flex-1' />
                                </div>
                            </div>

                            {/* <div className='flex items-center gap-4 text-sm'>
                                <label className='flex items-center gap-1'>
                                    <input type='radio' name='guest' checked={guestType === 'self'} onChange={() => setGuestType('self')} />
                                    I'm the guest
                                </label>
                                <label className='flex items-center gap-1'>
                                    <input type='radio' name='guest' checked={guestType === 'other'} onChange={() => setGuestType('other')} />
                                    I'm booking for another person
                                </label>
                            </div> */}
                        </div>

                        {/* Stay Details */}
                        <div className='border rounded-xl p-5 shadow-sm space-y-4'>
                            <h2 className='font-semibold text-lg'>Stay Details at {`${rates.room.hotel.name}`}</h2>
                            <p className='text-sm text-gray-500'>For smoother check-in, enter the guest’s name as written on ID card.</p>

                            <div className='space-y-2'>
                                <p className='font-medium'>{rates.plan}</p>
                                <ul className='list-disc ml-5 text-sm text-gray-600 space-y-1'>
                                    <li>{`${rates.room.capacity}`} Guest</li>
                                    <li>{`${bookingData.adult}`} Adult</li>
                                    <li>{`${bookingData.children}`} Children</li>
                                    <li>{facility ? facility : 'None'}</li>
                                    {!rates.smoking_policy && <li>Non-Smoking Room</li>}
                                </ul>
                            </div>

                            <textarea
                                name='specialRequest'
                                className='border rounded-lg p-2 w-full'
                                placeholder='Any special requests or needs?'
                                rows={3}
                            />
                        </div>

                        {/* Policy */}
                        <div className='border rounded-xl p-5 shadow-sm'>
                            <h2 className='font-semibold text-lg'>Cancellation Policy</h2>
                            <p className='text-sm text-gray-600'>
                                Refund and reschedule not allowed. If you don’t arrive on check-in date, it will be consideblue no-show.
                            </p>
                        </div>

                        <div className='border rounded-xl p-5 shadow-sm'>
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
                        <div className='border rounded-xl shadow-sm overflow-hidden'>
                            <img src={`http://127.0.0.1:8000/storage/${rates.room.image}`} alt='Hotel Room' className='w-full h-40 object-cover' />
                            <div className='p-4 space-y-2'>
                                <h3 className='font-semibold'>{rates.room.name}</h3>
                                <p className='text-sm text-gray-600'>
                                    {getDayName(bookingData.checkIn)} {bookingData.checkIn} - {getDayName(bookingData.checkOut)}{' '}
                                    {bookingData.checkOut} <br />1 Night • 1 Room • {rates.room.capacity} Guest
                                </p>
                                <p className='text-right font-bold text-blue-700'>{formatRupiah(rates.rate)}</p>
                            </div>
                        </div>

                        {/* Coupon */}
                        {/* <div className='border rounded-xl p-4 shadow-sm space-y-2'>
                            <h2 className='font-semibold text-lg'>Apply Coupons</h2>
                            <div className='flex gap-2'>
                                <input type='text' placeholder='Enter coupon' className='border rounded-lg p-2 flex-1' />
                                <button className='bg-blue-700 text-white px-4 rounded-lg hover:bg-blue-800'>Apply</button>
                            </div>
                        </div> */}

                        {/* Total */}
                        <div className='border rounded-xl p-4 shadow-sm space-y-4'>
                            <div className='flex justify-between text-lg font-semibold'>
                                <span>Total</span>
                                <span className='text-blue-700'>{formatRupiah(rates.rate)}</span>
                            </div>
                            <button
                                type='submit'
                                className='w-full bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-800 transition'>
                                Continue To Payment
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
