'use client';

import { useState } from 'react';
import { FaMapMarkerAlt, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import ReviewSummary from '../../Elements/ReviewSummary';
import SectionNav from '../../Elements/SectionNav';

export default function DestinationDescription({ destination, reviews, facilities }) {
    const [currentReview, setCurrentReview] = useState(0);
    const [showMore, setShowMore] = useState(true);
    const [showFacilities, setShowFacilities] = useState(true);
    const facilityList = destination.destination_facility ? destination.destination_facility.name.split(',') : [];
    const nextReview = () => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const handleDescription = () => {
        setShowMore(!showMore);
    };

    const handleFacilities = () => {
        setShowFacilities(!showFacilities);
    };

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (
        <div id='tickets' className='w-full max-w-6xl mx-auto border border-gray-300 m-5 p-4 my-10 flex flex-col lg:flex-row gap-4'>
            {/* Kiri */}
            <div className='flex-1 border-gray-300 space-y-3'>
                <div className='flex justify-between items-center'>
                    <span className='bg-red-600 text-white text-xs px-2 py-1'>Promo WOW Akhir Pekan</span>
                </div>
                
                {destination.price > 0 && (
                    <div className='flex justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Starts from</p>
                            <div className='flex items-baseline gap-2'>
                                <p className='text-red-600 font-bold text-lg'>{formatRupiah(destination.price)}</p>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <a href={`/booking?destination=${destination.slug}`} className='bg-orange-500 text-white px-3 py-1 font-semibold'>Buy Tickets</a>
                        </div>
                    </div>
                )}
                <div className='flex border-t pt-2 justify-between items-center'>
                    <h3 className='font-bold text-sm text-primary'>What You Will Get</h3>
                </div>

                <div className='flex flex-col justify-between items-start'>
                    <p>{!showFacilities ? destination?.description || '' : (destination?.description || '').substring(0, 100) + '...'}</p>
                    {!showFacilities ? (
                        <ul className='mt-3'>
                            <h5 className='text-primary text-base font-semibold'>Facilities :</h5>
                            {facilityList.map((facility, index) => (
                                <li key={index} className='ms-5 text-black list-disc'>
                                    {facility.trim()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        ''
                    )}
                </div>
                <div>
                    <button onClick={handleFacilities} className='text-blue-600 text-sm font-semibold'>
                        {showFacilities ? 'Show More' : 'Show Less'}
                    </button>
                </div>
            </div>
            {/* {reviews.length > 0 && (
            )} */}

            {/* Kanan */}
            {reviews.length > 0 && (
                <div className='flex-1 space-y-3 border-l ps-3'>
                    <ReviewSummary
                        average={reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0}
                        total={reviews.length}
                        flex='flex-col'
                        width='w-1/2'
                        padding='px-4 pt-2'
                    />

                    <div className='flex items-center gap-2 text-sm text-gray-600 m-0'>
                        <FaMapMarkerAlt />
                        <span> {destination.location}</span>
                    </div>

                    <div className='space-y-1'>
                        <h3 className='font-bold text-blue-700 text-sm'>What You'll Experience</h3>
                        <p>{!showMore ? destination?.description || '' : (destination?.description || '').substring(0, 100) + '...'}</p>

                        <button onClick={handleDescription} className='text-blue-600 text-sm font-semibold'>
                            {showMore ? 'Show More' : 'Show Less'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
