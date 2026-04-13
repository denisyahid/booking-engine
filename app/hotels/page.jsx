'use client';

import { hotelAPI } from '../../src/services/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Fragments/Navbar';
import DestinationHero from '../../components/Fragments/DestinationHero';
import Footer from '../../components/Fragments/Footer';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Mail, Phone } from 'lucide-react';

// Get API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8000';

// Helper function to get full image URL
const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}/storage/${path}`;
};

export default function HotelsPage() {
    const [filters, setFilters] = useState({
        priceRange: '0-500000',
        type: [],
        sort: 'popular',
    });
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        hotelAPI.list({
            params: {
                search: e.target.search.value,
                location: e.target.location.value
            }
        })
        .then((res) => {
            const hotelData = Array.isArray(res.data)
                ? res.data
                : (res.data?.data || []);
            setHotels(hotelData);
        })
    }

    const priceRanges = [
        { title: '0 - Rp.500.000', value: '0-500000' },
        { title: 'Rp.500.000 - Rp.1.000.000', value: '500000-1000000' },
        { title: 'Rp.1.000.000 - Rp.2.000.000', value: '1000000-2000000' },
        { title: 'Rp.2.000.000+', value: '2000000-99999999' },
    ];

    const hotelTypes = [
        { title: 'Hotel', value: 'hotel' },
        { title: 'Resort', value: 'resort' },
        { title: 'Villa', value: 'villa' },
        { title: 'Apartment', value: 'apartment' },
    ];

    // Fetch default data
    useEffect(() => {
        setLoading(true);
        hotelAPI.list()
            .then((res) => {
                const hotelData = Array.isArray(res.data)
                    ? res.data
                    : (res.data?.data || []);
                setHotels(hotelData);
                console.log(res.data);
                console.log(filters);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // Fetch data setiap filter berubah
    useEffect(() => {
        // Note: hotelAPI.search belum ada, bisa ditambahkan nanti
        // Untuk sekarang filter manual
        let filtered = hotels;
        
        if (filters.sort === 'price_asc') {
            filtered = [...hotels].sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (filters.sort === 'price_desc') {
            filtered = [...hotels].sort((a, b) => (b.price || 0) - (a.price || 0));
        }
        
        setHotels(filtered);
    }, [filters]);

    const handleTypeChange = (value, checked) => {
        if (checked) {
            setFilters((prev) => ({
                ...prev,
                type: [...prev.type, value],
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                type: prev.type.filter((t) => t !== value),
            }));
        }
    };

    const formatRupiah = (num) => 'IDR ' + (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return (
        <>
            <Navbar />
            <DestinationHero search={search} setSearch={setSearch} location={location} setLocation={setLocation} handleSearch={handleSearch} />
            <div className='w-full bg-gray-50 py-6 md:py-10 mt-14'>
                <div className='max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
                    {/* Main Content */}
                    <main className='col-span-1 md:col-span-3'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg md:text-xl font-bold text-gray-800'>Hotels</h2>
                            <select
                                value={filters.sort}
                                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                className='border px-2 py-1'>
                                <option value='popular'>Most Popular</option>
                                <option value='price_asc'>Lowest Price</option>
                                <option value='price_desc'>Highest Price</option>
                            </select>
                        </div>

                        {loading ? (
                            <p className='text-gray-500'>Loading...</p>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {hotels.map((item) => (
                                    <Link key={item.id} href={`/${item.slug}`}>
                                        <article className='w-full flex-shrink-0 border rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition-all duration-300 group'>
                                            <div className='relative'>
                                                {item.logo ? (
                                                    <img
                                                        loading='lazy'
                                                        src={getImageUrl(item.logo)}
                                                        alt={item.name}
                                                        className='w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300'
                                                    />
                                                ) : (
                                                    <div className='w-full h-48 md:h-56 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center'>
                                                        <span className='text-blue-400 text-4xl'>🏨</span>
                                                    </div>
                                                )}
                                                
                                                {/* Star Rating Badge */}
                                                {item.star_rating && (
                                                    <div className='absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-md shadow-md flex items-center gap-1'>
                                                        {Array.from({ length: item.star_rating }).map((_, i) => (
                                                            <span key={i} className='text-yellow-500 text-sm'>★</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className='p-4'>
                                                <h3 className='font-sans text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors'>{item.name}</h3>
                                                
                                                {item.location && (
                                                    <p className='my-1 text-gray-600 text-sm flex items-center gap-1'>
                                                        <span className='text-xs'>📍</span> {item.location}
                                                    </p>
                                                )}
                                                
                                                {item.description && (
                                                    <p className='text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed'>
                                                        {item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
                                                    </p>
                                                )}
                                                
                                                {/* Amenities Icons (placeholder - bisa ditambah nanti) */}
                                                <div className='flex items-center gap-3 mb-3 text-gray-500 text-xs'>
                                                    {item.phone && (
                                                        <span className='flex items-center gap-1'>📞 Available</span>
                                                    )}
                                                    {item.email && (
                                                        <span className='flex items-center gap-1'>✉️ Book Online</span>
                                                    )}
                                                </div>
                                                
                                                {item.price > 0 && (
                                                    <div className='pt-3 border-t border-gray-100'>
                                                        <p className='text-xs text-gray-500 mb-1'>Start from</p>
                                                        
                                                        {item.has_discount && item.original_price > item.price ? (
                                                            <div className='flex items-center gap-2'>
                                                                <p className='text-sm text-gray-400 line-through'>
                                                                    {formatRupiah(item.original_price)}
                                                                </p>
                                                                <p className='text-lg font-bold text-red-600'>
                                                                    {formatRupiah(item.price)}
                                                                </p>
                                                                <span className='text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold'>
                                                                    -{Math.round(item.discount_percent)}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <p className='text-lg font-bold text-blue-600'>
                                                                {formatRupiah(item.price)}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className='col-span-1 bg-white border p-4 h-fit'>
                        <h3 className='font-bold text-gray-800 mb-3'>Price Range</h3>
                        <select
                            className='w-full border px-2 py-1'
                            value={filters.priceRange}
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}>
                            {priceRanges.map((price, idx) => (
                                <option key={idx} value={price.value}>
                                    {price.title}
                                </option>
                            ))}
                        </select>

                        <h3 className='font-bold text-gray-800 mt-6 mb-3'>Hotel Type</h3>
                        {hotelTypes.map((type, idx) => (
                            <label key={idx} className='block'>
                                <input
                                    type='checkbox'
                                    value={type.value}
                                    checked={filters.type.includes(type.value)}
                                    onChange={(e) => handleTypeChange(type.value, e.target.checked)}
                                />{' '}
                                {type.title}
                            </label>
                        ))}
                    </aside>
                </div>
            </div>
            <footer className='bg-primary text-white px-6 md:px-16 lg:px-24 py-10'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                    {/* Bagian Kiri */}
                    <div>
                        <h2 className='text-4xl font-bold mb-4'>Najjo</h2>
                        <p className='text-lg mb-6'>Najjo GROUP</p>
                        <p className='text-sm leading-relaxed'></p>
                        <div className='mt-6 space-y-2'>
                            <p className='flex items-center gap-2 text-sm'>
                                <Mail className='w-4 h-4' /> najjo@gmail.com
                            </p>
                            <p className='flex items-center gap-2 text-sm'>
                                <Phone className='w-4 h-4' /> 12345678
                            </p>
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
                            <a href='#'>
                                <FaInstagram size={22} />
                            </a>
                            <a href='#'>
                                <FaYoutube size={22} />
                            </a>
                            <a href='#'>
                                <FaLinkedin size={22} />
                            </a>
                        </div>
                        <div className='mt-4 flex'>
                            <input type='email' placeholder='Enter Your Email' className='w-full p-2 text-black outline-none' />
                            <button className='bg-gray-700 hover:bg-gray-800 px-4 '>Subscribe</button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
