import React, { useState } from 'react';

export default function BookingForm() {
    const [guestType, setGuestType] = useState('self');

    return (
        <div className='min-h-screen bg-gray-100 flex justify-center py-6 px-3'>
            <div className='w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden'>
                {/* Header */}
                <div className='bg-blue-800 text-white p-5 text-center text-xl font-semibold'>Your Accommodation Booking</div>

                {/* Content */}
                <form method='POST'  className='grid md:grid-cols-3 gap-6 p-6'>
                    {/* Left Content */}
                    <div className='md:col-span-2 space-y-6'>
                        {/* Contact Details */}
                        <div className='border rounded-xl p-5 space-y-4 shadow-sm'>
                            <h2 className='font-semibold text-lg'>Contact Details</h2>
                            <div className='grid md:grid-cols-2 gap-4'>
                                <select className='border rounded-lg p-2'>
                                    <option>Mr.</option>
                                    <option>Mrs.</option>
                                    <option>Ms.</option>
                                </select>
                                <input type='text' placeholder='Full Name' className='border rounded-lg p-2' />
                                <input type='email' placeholder='Email Address' className='border rounded-lg p-2 col-span-2' />
                                <div className='flex col-span-2 gap-2'>
                                    <select className='border rounded-lg p-2 w-28'>
                                        <option>+62</option>
                                        <option>+60</option>
                                        <option>+65</option>
                                    </select>
                                    <input type='tel' placeholder='Mobile Number' className='border rounded-lg p-2 flex-1' />
                                </div>
                            </div>

                            <div className='flex items-center gap-4 text-sm'>
                                <label className='flex items-center gap-1'>
                                    <input type='radio' name='guest' checked={guestType === 'self'} onChange={() => setGuestType('self')} />
                                    I'm the guest
                                </label>
                                <label className='flex items-center gap-1'>
                                    <input type='radio' name='guest' checked={guestType === 'other'} onChange={() => setGuestType('other')} />
                                    I'm booking for another person
                                </label>
                            </div>
                        </div>

                        {/* Stay Details */}
                        <div className='border rounded-xl p-5 shadow-sm space-y-4'>
                            <h2 className='font-semibold text-lg'>Stay Details at Nata Azana Hotel Solo</h2>
                            <p className='text-sm text-gray-500'>For smoother check-in, enter the guest’s name as written on ID card.</p>

                            <div className='space-y-2'>
                                <p className='font-medium'>Room Only (1x)</p>
                                <ul className='list-disc ml-5 text-sm text-gray-600 space-y-1'>
                                    <li>1 Guest</li>
                                    <li>Bedroom: 2 Single Bed, Bathrooms: 1 Private</li>
                                    <li>Free Netflix, WiFi, Air Conditioning, Bottled Water, etc.</li>
                                    <li>Non-Smoking Room</li>
                                </ul>
                            </div>

                            <textarea className='border rounded-lg p-2 w-full' placeholder='Any special requests or needs?' rows={3} />
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
                                    Check-In: <span className='font-medium'>14:00 Local Time</span>
                                </p>
                                <p>
                                    Check-Out: <span className='font-medium'>12:00 Local Time</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className='space-y-6'>
                        {/* Booking Summary */}
                        <div className='border rounded-xl shadow-sm overflow-hidden'>
                            <img
                                src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
                                alt='Hotel Room'
                                className='w-full h-40 object-cover'
                            />
                            <div className='p-4 space-y-2'>
                                <h3 className='font-semibold'>Nata Azana Hotel Solo</h3>
                                <p className='text-sm text-gray-600'>
                                    Friday, 29/8/2025 - Saturday, 30/8/2025 <br />1 Night • 1 Room • 1 Guest
                                </p>
                                <p className='text-right font-bold text-blue-700'>IDR 618.000</p>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className='border rounded-xl p-4 shadow-sm space-y-2'>
                            <h2 className='font-semibold text-lg'>Apply Coupons</h2>
                            <div className='flex gap-2'>
                                <input type='text' placeholder='Enter coupon' className='border rounded-lg p-2 flex-1' />
                                <button className='bg-blue-700 text-white px-4 rounded-lg hover:bg-blue-800'>Apply</button>
                            </div>
                        </div>

                        {/* Total */}
                        <div className='border rounded-xl p-4 shadow-sm space-y-4'>
                            <div className='flex justify-between text-lg font-semibold'>
                                <span>Total</span>
                                <span className='text-blue-700'>IDR 618.000</span>
                            </div>
                            <button className='w-full bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-800 transition'>
                                Continue To Payment
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
