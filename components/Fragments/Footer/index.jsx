import { Mail, Phone } from 'lucide-react';
import { FaInstagram, FaYoutube, FaTiktok, FaFacebook, FaLinkedin } from 'react-icons/fa';

export default function Footer({hotel}) {
    // If no hotel prop provided, show generic footer
    if (!hotel || !hotel.name) {
        return (
            <footer className='bg-blue-600 text-white px-6 md:px-16 lg:px-24 py-10'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                    {/* Bagian Kiri */}
                    <div>
                        <h2 className='text-4xl font-bold mb-4'>Najjo Hotels</h2>
                        <p className='text-lg mb-6'>Central Reservation System</p>
                        <p className='text-sm leading-relaxed'>
                            Discover comfortable and affordable accommodations across Indonesia.
                        </p>
                        <div className='mt-6 space-y-2'>
                            <p className='flex items-center gap-2 text-sm'>
                                <Mail className='w-4 h-4' /> info@najjohotels.com
                            </p>
                            <p className='flex items-center gap-2 text-sm'>
                                <Phone className='w-4 h-4' /> +62 812 3456 7890
                            </p>
                        </div>
                    </div>

                    {/* Bagian Tengah */}
                    <div className='space-y-3'>
                        <h3 className='font-semibold text-lg mb-4'>Quick Links</h3>
                        <ul className='space-y-3'>
                            <li><a href='/hotels' className='hover:underline'>Hotels</a></li>
                            <li><a href='/destination' className='hover:underline'>Destination</a></li>
                            <li><a href='/login' className='hover:underline'>Log In</a></li>
                            <li><a href='/register' className='hover:underline'>Register</a></li>
                        </ul>
                    </div>

                    {/* Bagian Kanan */}
                    <div className='space-y-4'>
                        <p className='font-semibold'>FOLLOW US:</p>
                        <div className='flex gap-4'>
                            <a href='#' className='hover:text-gray-300'><FaInstagram size={22} /></a>
                            <a href='#' className='hover:text-gray-300'><FaYoutube size={22} /></a>
                            <a href='#' className='hover:text-gray-300'><FaLinkedin size={22} /></a>
                        </div>
                        <div className='mt-4'>
                            <p className='text-sm mb-2'>Subscribe to our newsletter:</p>
                            <div className='flex'>
                                <input type='email' placeholder='Enter Your Email' className='w-full p-2 text-black outline-none rounded-l' />
                                <button className='bg-gray-700 hover:bg-gray-800 px-4 rounded-r'>Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-10 pt-6 border-t border-blue-500 text-center text-sm text-blue-100'>
                    &copy; {new Date().getFullYear()} Najjo Hotels. All rights reserved.
                </div>
            </footer>
        );
    }

    return (
        <footer className='bg-primary text-white px-6 md:px-16 lg:px-24 py-10'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                {/* Bagian Kiri */}
                <div>
                    <h2 className='text-4xl font-bold mb-4'>{hotel.name}</h2>
                    <p className='text-lg mb-6'>{hotel.name} GROUP</p>
                    <p className='text-sm leading-relaxed'>{hotel.description?.substring(0, 150) || 'Welcome to our hotel'}</p>
                    <div className='mt-6 space-y-2'>
                        {hotel.email && (
                            <p className='flex items-center gap-2 text-sm'>
                                <Mail className='w-4 h-4' /> <a href={`mailto:${hotel.email}`} className='hover:underline'>{hotel.email}</a>
                            </p>
                        )}
                        {(hotel.phone || hotel.telephone) && (
                            <p className='flex items-center gap-2 text-sm'>
                                <Phone className='w-4 h-4' /> <a href={`tel:${hotel.phone || hotel.telephone}`} className='hover:underline'>{hotel.phone || hotel.telephone}</a>
                            </p>
                        )}
                    </div>
                </div>

                {/* Bagian Tengah */}
                <div className='space-y-3'>
                    <ul className='space-y-3'>
                        <li>
                            <a href='#' className='hover:underline'>
                                Careers
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:underline'>
                                News & Media
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:underline'>
                                Site Map
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Bagian Kanan */}
                <div className='space-y-4'>
                    <p className='font-semibold'>FOLLOW US :</p>
                    <div className='flex gap-4'>
                        {hotel.facebook && (
                            <a href={hotel.facebook} target='_blank' rel='noopener noreferrer' className='hover:text-blue-300 transition-colors'>
                                <FaFacebook size={22} />
                            </a>
                        )}
                        {hotel.instagram && (
                            <a href={hotel.instagram} target='_blank' rel='noopener noreferrer' className='hover:text-pink-300 transition-colors'>
                                <FaInstagram size={22} />
                            </a>
                        )}
                        {hotel.youtube && (
                            <a href={hotel.youtube} target='_blank' rel='noopener noreferrer' className='hover:text-red-300 transition-colors'>
                                <FaYoutube size={22} />
                            </a>
                        )}
                        {hotel.tiktok && (
                            <a href={hotel.tiktok} target='_blank' rel='noopener noreferrer' className='hover:text-gray-300 transition-colors'>
                                <FaTiktok size={22} />
                            </a>
                        )}
                        {!hotel.facebook && !hotel.instagram && !hotel.youtube && !hotel.tiktok && (
                            <a href='#' className='hover:text-gray-300'><FaInstagram size={22} /></a>
                        )}
                    </div>
                    <div className='mt-4 flex'>
                        <input type='email' placeholder='Enter Your Email' className='w-full p-2 text-black outline-none' />
                        <button className='bg-gray-700 hover:bg-gray-800 px-4 '>Subscribe</button>
                    </div>
                </div>
            </div>

            <div className='mt-10 pt-6 border-t border-blue-500 text-center text-sm text-blue-100'>
                &copy; {new Date().getFullYear()} {hotel.name}. All rights reserved.
            </div>
        </footer>
    );
}
