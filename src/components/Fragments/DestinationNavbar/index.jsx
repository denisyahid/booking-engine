import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function DestinationNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className='w-full bg-white shadow-md fixed top-0 left-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16 items-center'>
                    {/* Logo */}
                    <div className='flex-shrink-0 text-2xl font-bold text-blue-600'>
                        {/* Najjo */}
                        <img className='w-24' src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=140,fit=crop,q=95/dWxb12zNMXS08Rzz/najjo-logo-2---rectangle-m5KbZENbyRtoqrXd.png" alt="" />
                    </div>

                    {/* Menu Desktop */}
                    <div className='hidden md:flex space-x-6 items-center'>
                        <a href='/' className='text-gray-700 hover:text-blue-600'>
                            Hotels
                        </a>
                        <a href='/destination' className='text-gray-700 hover:text-blue-600'>
                            Destination
                        </a>
                        <a href='/login' className='px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition'>
                            Log In
                        </a>
                        <a href='/register' className='px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition'>
                            Register
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className='md:hidden flex items-center'>
                        <button onClick={() => setIsOpen(!isOpen)} className='text-gray-700 focus:outline-none'>
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='md:hidden bg-white border-t shadow-sm'>
                    <div className='px-4 py-3 space-y-3'>
                        <a href='#hotels' className='block text-gray-700 hover:text-blue-600'>
                            Hotels
                        </a>
                        <a href='#destination' className='block text-gray-700 hover:text-blue-600'>
                            Destination
                        </a>
                        <a href='#login' className='block px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition'>
                            Log In
                        </a>
                        <a href='#register' className='block px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition'>
                            Register
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
