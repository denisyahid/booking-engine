import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const BookingForm = () => {
    const [minDate, setMinDate] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckout] = useState('');
    const [adult, setAdult] = useState(0);
    const [children, setChildren] = useState(0);

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const searchData = location.state;

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setMinDate(`${year}-${month}-${day}`);
    }, []);

    const handleForm = (e) => {
        e.preventDefault();
        navigate(`/${id}`, {
            state: {
                checkIn,
                checkOut,
                adult,
                children,
            },
        });
    };

    return (
        <div className='md:sticky top-0 z-50 bg-black/70 backdrop-blur-sm max-w-6xl md:my-10 rounded-xl p-4 md:p-6 md:mx-auto shadow-lg border border-black/40'>
            <form onSubmit={handleForm} className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end'>
                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Check in</label>
                    <input
                        type='date'
                        min={minDate}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Check out</label>
                    <input
                        type='date'
                        min={minDate}
                        value={checkOut}
                        onChange={(e) => setCheckout(e.target.value)}
                        className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Adult</label>
                    <input
                        type='number'
                        value={adult}
                        onChange={(e) => setAdult(e.target.value)}
                        placeholder='2'
                        className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div className='flex gap-3 items-end'>
                    <div className='flex-1'>
                        <label className='block text-xs text-white/80 uppercase mb-2'>Children</label>
                        <input
                            type='number'
                            value={children}
                            onChange={(e) => setChildren(e.target.value)}
                            placeholder='1'
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
