import ErrorElement from '../../Elements/ErrorElement';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../src/context/AuthContext';

export default function Navbar({hotel}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    // If no hotel prop provided, show generic navbar
    if (!hotel || !hotel.name) {
        return (
            <header className='w-full shadow-md bg-white'>
                <div className='max-w-6xl mx-auto px-4 md:px-8'>
                    <div className='flex items-center justify-between h-16'>
                        <div className='flex items-center space-x-4'>
                            <img className='w-24' src='https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=140,fit=crop,q=95/dWxb12zNMXS08Rzz/najjo-logo-2---rectangle-m5KbZENbyRtoqrXd.png' alt='Najjo Hotels' />
                        </div>
                        <nav className='hidden md:flex space-x-6'>
                            <a href='/hotels' className='text-gray-700 hover:text-blue-600 font-medium'>Hotels</a>
                            <a href='/destination' className='text-gray-700 hover:text-blue-600 font-medium'>Destination</a>
                            {isAuthenticated ? (
                                <>
                                    <a href='/my-bookings' className='text-gray-700 hover:text-blue-600 font-medium'>My Bookings</a>
                                    <a href='/profile' className='text-gray-700 hover:text-blue-600 font-medium'>Profile</a>
                                    <button
                                        type='button'
                                        onClick={handleLogout}
                                        className='px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition'>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a href='/login' className='px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition'>Log In</a>
                                    <a href='/register' className='px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition'>Register</a>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
        );
    }

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
                                {hotel.email}
                            </a>
                        </div>

                        {/* Center logo/title */}
                        <div className='flex justify-center text-center'>
                            {/* <img className='w-20' src="/images/klinik.png" alt="" /> */}
                            <h1 className='font-sans font-medium text-3xl md:text-4xl leading-tight'>
                                {hotel.name}
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
                            <span className='text-gray-800 tracking-wide'>{hotel.phone || hotel.telephone}</span>
                        </div>

                        {/* Mobile controls: hamburger */}
                        {/* <div className='md:hidden flex items-center space-x-2'>
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
                        </div> */}
                    </div>
                </div>

                {/* Mobile top compact info (visible when menu closed) */}
                <div className='md:hidden border-t'>
                    <div className='max-w-6xl mx-auto px-4 py-2 flex items-center justify-between'>
                        <a href={`mailto:${hotel.email || ''}`} className='text-sm'>
                            {hotel.email}
                        </a>
                        <a href={`tel:${hotel.phone || hotel.telephone || ''}`} className='text-sm'>
                            {hotel.phone || hotel.telephone}
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
