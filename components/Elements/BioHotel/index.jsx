import {  useState } from 'react';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaGlobe } from 'react-icons/fa';
import ErrorElement from '../ErrorElement';
import Gallery from '../Gallery';

// Get API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8000';

export default function BioHotel({hotel,images}) {
    const [showMore, setShowMore] = useState(false);

    if (!hotel) return <ErrorElement />;

    // Helper function to get full image URL
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}/storage/${path}`;
    };

    // Use star_rating or default to 3
    const starRating = hotel.star_rating || 3;

    return (
        <div className='max-w-6xl mx-auto gap-5 flex flex-wrap md:flex-nowrap items-center md:py-10'>
            <div className='w-full md:w-1/2 mx-5 md:mx-auto rounded bg-white p-6 py-10 border shadow-lg my-10'>
                {/* Hotel Logo */}
                <div className='flex items-center gap-3 mb-3'>
                    {hotel.logo ? (
                        <img
                            src={getImageUrl(hotel.logo)}
                            alt={hotel.name}
                            className='w-16 h-16 object-contain rounded-lg border p-1'
                        />
                    ) : (
                        <div className='w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center'>
                            <span className='text-3xl'>🏨</span>
                        </div>
                    )}
                    <div>
                        <h3 className='text-xl font-bold text-gray-800'>{hotel.name}</h3>
                        <div className='flex items-center gap-1 text-yellow-400'>
                            {Array.from({ length: starRating }).map((_, i) => (
                                <FaStar key={i} />
                            ))}
                            <span className='text-gray-500 text-sm ml-2'>({starRating} Star Hotel)</span>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className='flex items-center gap-2 text-gray-600 mb-3'>
                    <FaMapMarkerAlt className='text-primary flex-shrink-0' />
                    <span className='text-sm'>{hotel.location || hotel.address}</span>
                </div>

                {/* Description */}
                {hotel.description && hotel.description !== hotel.address && (
                    <>
                        <p className='text-gray-700 mt-2 text-sm leading-relaxed'>
                            {showMore ? hotel.description : hotel.description?.substring(0, 250)}
                            {hotel.description?.length > 250 && !showMore && '...'}
                        </p>
                        {hotel.description?.length > 250 && (
                            <button 
                                type='button' 
                                onClick={() => setShowMore(!showMore)} 
                                className='mt-2 text-primary font-semibold text-sm hover:underline'
                            >
                                {showMore ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </>
                )}

                {/* Social Media */}
                {(hotel.facebook || hotel.instagram || hotel.youtube || hotel.tiktok || hotel.website) && (
                    <div className='flex gap-4 mt-4 text-xl border-t pt-4'>
                        {hotel.facebook && (
                            <a href={hotel.facebook} target='_blank' rel='noreferrer'>
                                <FaFacebook className='text-primary hover:scale-110 transition-transform' />
                            </a>
                        )}
                        {hotel.instagram && (
                            <a href={hotel.instagram} target='_blank' rel='noreferrer'>
                                <FaInstagram className='text-pink-500 hover:scale-110 transition-transform' />
                            </a>
                        )}
                        {hotel.youtube && (
                            <a href={hotel.youtube} target='_blank' rel='noreferrer'>
                                <FaYoutube className='text-red-600 hover:scale-110 transition-transform' />
                            </a>
                        )}
                        {hotel.tiktok && (
                            <a href={hotel.tiktok} target='_blank' rel='noreferrer'>
                                <FaTiktok className='hover:scale-110 transition-transform' />
                            </a>
                        )}
                        {hotel.website && (
                            <a href={hotel.website} target='_blank' rel='noreferrer'>
                                <FaGlobe className='text-blue-500 hover:scale-110 transition-transform' />
                            </a>
                        )}
                    </div>
                )}
            </div>
            <Gallery images={images} />
        </div>
    );
}
