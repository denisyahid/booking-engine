import React, { useRef, useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axios from 'axios';

const BookingForm = ({ slug, adult, children, setAdult, setChildren, handleDateChange ,range}) => {
    const [open, setOpen] = useState(false);

    const refOne = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (refOne.current && !refOne.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    // Format DD/MM/YYYY
    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
    };

    return (
        <div className='sticky top-0 z-50 bg-black/70 p-4 max-w-6xl mx-auto shadow-lg border border-black/40 my-10'>
            <form onSubmit={handleSubmit} action={`/${slug}`} method='GET' className='grid gap-3'>
                <div className='flex items-end gap-4 w-full'>
                    {/* Check In - Check Out */}
                    <div className='flex-1 relative'>
                        <label className='block text-white/80 mb-1 text-sm'>Check In - Check Out</label>
                        <input
                            type='text'
                            name='checkInCheckOut'
                            readOnly
                            value={`${formatDate(range[0].startDate)} - ${formatDate(range[0].endDate)}`}
                            onClick={() => setOpen(!open)}
                            className='w-full p-2 border cursor-pointer focus:outline-none'
                            placeholder='Pilih tanggal'
                        />

                        {/* Hidden input biar bisa dikirim ke backend */}
                        <input type='hidden' name='checkIn' value={formatDate(range[0].startDate)} />
                        <input type='hidden' name='checkOut' value={formatDate(range[0].endDate)} />

                        {open && (
                            <div ref={refOne} className='absolute z-50 mt-2 shadow-lg'>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={handleDateChange}
                                    moveRangeOnFirstSelection={false}
                                    ranges={range}
                                    months={2}
                                    direction='horizontal'
                                    minDate={new Date()}
                                />
                            </div>
                        )}
                    </div>

                    {/* Adult */}
                    <div className='flex-1'>
                        <label className='block text-xs text-white/80 uppercase mb-2'>Adult</label>
                        <input
                            type='number'
                            name='adult'
                            value={adult}
                            onChange={(e) => setAdult(Number(e.target.value))}
                            min='1'
                            className='w-full p-2 border cursor-pointer focus:outline-none'
                        />
                    </div>

                    {/* Children */}
                    <div className='flex-1'>
                        <label className='block text-xs text-white/80 uppercase mb-2'>Children</label>
                        <input
                            type='number'
                            name='children'
                            value={children}
                            onChange={(e) => setChildren(Number(e.target.value))}
                            min='0'
                            className='w-full p-2 border cursor-pointer focus:outline-none'
                        />
                    </div>

                    {/* Rooms */}
                    <div className='flex-1'>
                        <label className='block text-xs text-white/80 uppercase mb-2'>Rooms</label>
                        {/* <select className='w-full p-2 border cursor-pointer focus:outline-none' name='room' id='room'>
                            {rooms.map((room) => {
                                return <option value={room.name}>{room.name}</option>;
                            })}
                        </select> */}
                        <input
                            type='number'
                            name='rooms'
                            value={1}
                            onChange={(e) => setRooms(Number(e.target.value))}
                            min='1'
                            className='w-full p-2 border cursor-pointer focus:outline-none'
                        />
                    </div>

                    {/* Tombol */}
                    <button type='submit' className='bg-primary hover:bg-blue-700 text-white h-11 flex items-center justify-center px-6'>
                        CARI
                    </button>
                </div>

                {/* <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Check in</label>
                    <input
                        required
                        type='date'
                        name='checkIn'
                        min={getTodayDate()}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className='w-full bg-white px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Check out</label>
                    <input
                        required
                        type='date'
F                        name='checkOut'
                        min={checkIn}
                        value={checkOut}
                        onChange={(e) => setCheckout(e.target.value)}
                        className='w-full bg-white px-3 py-2 text-sm shadow-sm'
                    />
                </div> */}

                {/* <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Adult</label>
                    <input
                        type='number'
                        name='adult'
                        value={adult}
                        onChange={(e) => setAdult(Number(e.target.value))}
                        min='1'
                        className='w-full bg-white px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div className='flex gap-3 items-end'>
                    <div className='flex-1'>
                        <label className='block text-xs text-white/80 uppercase mb-2'>Children</label>
                        <input
                            type='number'
                            name='children'
                            value={children}
                            onChange={(e) => setChildren(Number(e.target.value))}
                            min='0'
                            className='w-full bg-white px-3 py-2 text-sm shadow-sm'
                        />
                    </div>

                    <button
                        type='submit'
                        className='ml-2 bg-blue-600 hover:bg-blue-700 h-10 text-white px-4 py-2 text-sm whitespace-nowrap'>
                        CARI
                    </button>
                </div> */}
            </form>
        </div>
    );
};

export default BookingForm;
