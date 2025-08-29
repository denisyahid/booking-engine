import React, { useState, useEffect } from 'react';

const BookingForm = () => {
    const [minDate, setMinDate] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckout] = useState('');
    const [adult, setAdult] = useState(0);
    const [children, setChildren] = useState(0);

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const todayFormatted = `${year}-${month}-${day}`;

        setMinDate(todayFormatted);
    }, []);

    const handleForm = async (e) => {

        const datas = {
            checkIn,
            checkOut,
            adult,
            children
        }

        console.log(datas)

        try {
            const response = await fetch('http://127.0.0.1:8000/booking',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datas),
            })
            console.log('Berhasil');
        } catch (err) {
            console.log(err);
        }
    };

    const handleCheckIn = (e) => {
        setCheckIn(e.target.value);
    };
    const handleCheckOut = (e) => {
        setCheckout(e.target.value);
    };
    const handleAdult = (e) => {
        setAdult(e.target.value);
    };
    const handleChildren = (e) => {
        setChildren(e.target.value);
    };

    return (
        <div className='sticky top-0 z-50 bg-black/70 backdrop-blur-sm max-w-6xl  rounded-xl p-4 md:p-6 md:mx-auto shadow-lg border border-black/40'>
            <form onSubmit={handleForm} action={'/booking'} method='POST' className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end'>
                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Check in</label>
                    <input
                        onChange={handleCheckIn}
                        min={minDate}
                        type='date'
                        defaultValue='2025-08-28'
                        className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Check out</label>
                    <input
                        onChange={handleCheckOut}
                        min={minDate}
                        type='date'
                        defaultValue='2025-08-29'
                        className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Adult</label>
                    <input
                        onChange={handleAdult}
                        type='number'
                        placeholder='2'
                        defaultValue='2025-08-29'
                        className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div className='flex gap-3 items-end'>
                    <div className='flex-1'>
                        <label className='block text-xs text-white/80 uppercase mb-2'>Children</label>
                        <input
                            onChange={handleChildren}
                            placeholder='1'
                            type='number'
                            defaultValue='2025-08-29'
                            className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
                        />
                    </div>

                    <button
                        type='submit'
                        className='ml-2 bg-blue-600 hover:bg-blue-700 h-10 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap'>
                        CARI
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
