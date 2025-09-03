import React from 'react';

const BookingForm = ({ checkIn, checkOut, adult, children, setCheckIn, setCheckout, setAdult, setChildren, getTodayDate, slug }) => {
    return (
        <div className='md:sticky top-0 z-50 m-5 md:m-0 bg-black/70 backdrop-blur-sm max-w-6xl md:my-10 rounded-xl p-4 md:p-6 md:mx-auto shadow-lg border border-black/40'>
            <form action={`/${slug}`} method='GET' className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end'>
                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Check in</label>
                    <input
                        required
                        type='date'
                        name='checkIn'
                        min={getTodayDate()}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Check out</label>
                    <input
                        required
                        type='date'
                        name='checkOut'
                        min={checkIn}
                        value={checkOut}
                        onChange={(e) => setCheckout(e.target.value)}
                        className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
                    />
                </div>

                <div>
                    <label className='block text-xs text-white/80 uppercase mb-2'>Adult</label>
                    <input
                        type='number'
                        name='adult'
                        value={adult}
                        onChange={(e) => setAdult(Number(e.target.value))}
                        min='1'
                        className='w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm'
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
            {/* {!checkIn || !checkOut || adult <= 0 ? <p className='mt-2 text-red-600'>Harap isi formulir di atas!</p> : null} */}
        </div>
    );
};

export default BookingForm;
