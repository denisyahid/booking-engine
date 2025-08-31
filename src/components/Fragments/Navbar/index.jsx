import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [nameHotel,setNameHotel] = useState('');
    const {id} = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/hotel/${id}`)
        .then((res) => {
            setNameHotel(res.data.data.name);
            // console.log(res.data.data.name);
        })
    },[])

    if(!nameHotel) return <p>Loading..</p>

    return (
        <header className='w-full shadow-md'>
            <div className='bg-white'>
                <div className='max-w-6xl mx-auto px-4 md:px-8'>
                    <div className='flex items-center justify-between h-28'>
                        <div className='hidden md:flex items-center space-x-4'>
                            <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                />
                            </svg>
                            <a href='mailto:example@gmail.com' className='text-gray-800 tracking-wide'>
                                example@gmail.com
                            </a>
                        </div>

                        {/* Center logo/title */}
                        <div className='flex-1 text-center'>
                            <h1 className='font-serif text-3xl md:text-4xl leading-tight'>
                                {nameHotel}
                            </h1>
                        </div>

                        {/* Right phone (desktop) */}
                        <div className='hidden md:flex items-center space-x-4'>
                            <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M3 5a2 2 0 012-2h2.6a1 1 0 01.97.757l.6 2.4a1 1 0 01-.217.9L8.5 9.6a11.042 11.042 0 005.9 5.9l1.543-1.043a1 1 0 01.9-.217l2.4.6A1 1 0 0121 17.4V20a2 2 0 01-2 2A19 19 0 013 5z'
                                />
                            </svg>
                            <span className='text-gray-800 tracking-wide'>(800) 123 456 789</span>
                        </div>

                        {/* Mobile controls: hamburger */}
                        <div className='md:hidden flex items-center space-x-2'>
                            <button
                                onClick={() => setOpen(!open)}
                                aria-label='Toggle navigation'
                                className='p-2 rounded focus:outline-none focus:ring-2'>
                                {open ? (
                                    <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                ) : (
                                    <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile top compact info (visible when menu closed) */}
                <div className='md:hidden border-t'>
                    <div className='max-w-6xl mx-auto px-4 py-2 flex items-center justify-between'>
                        <a href='mailto:example@gmail.com' className='text-sm'>
                            example@gmail.com
                        </a>
                        <a href='tel:+1800123456789' className='text-sm'>
                            (800) 123 456 789
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
