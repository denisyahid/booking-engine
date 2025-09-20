import { useState } from 'react';
import { FaMapMarkerAlt, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import ReviewSummary from '../../Elements/ReviewSummary';

export default function DestinationDescription({ destination, reviews, formatRupiah }) {
    const [currentReview, setCurrentReview] = useState(0);
    const [showMore, setShowMore] = useState(true);


    const nextReview = () => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const handleDescription = () => {
        setShowMore(!showMore);
    };

    return (
        <div className='w-full max-w-6xl mx-auto border border-gray-300 m-5 p-4 flex flex-col lg:flex-row gap-4'>
            {/* Kiri */}
            <div className='flex-1 space-y-3'>
                {/* <div className='flex items-center gap-2'>
                    <span className='text-blue-500 text-2xl font-bold'>★ 9,2</span>
                    <div>
                        <p className='text-sm font-semibold'>Exceptional</p>
                        <p className='text-xs text-gray-600'>21.616 reviews</p>
                    </div>
                </div> */}
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

                {/* <div>
                    <button className='text-sm text-blue-700 underline'>Contacts, Facilities, Service Languages, and More</button>
                </div> */}
            </div>

            {/* Kanan */}
            {reviews.length > 0 && (
                <div className='flex-1 border-l border-gray-300 pl-4 space-y-3'>
                    <div className='flex justify-between items-center'>
                        <span className='bg-red-600 text-white text-xs px-2 py-1'>Promo WOW Akhir Pekan</span>
                        <button className='bg-orange-500 text-white px-3 py-1 font-semibold'>Find Tickets</button>
                    </div>

                    <div>
                        <p className='text-sm text-gray-600'>Starts from</p>
                        <div className='flex items-baseline gap-2'>
                            <p className='text-red-600 font-bold text-lg'>{formatRupiah(destination.destination_rate.price)}</p>
                            {/* <p className='line-through text-gray-400 text-sm'>Rp 300.000</p> */}
                        </div>
                    </div>

                    <div className='flex justify-between items-center'>
                        <h3 className='font-bold text-sm'>What Travelers Say</h3>
                        {/* <button className='text-blue-600 text-sm font-semibold'>See All Reviews</button> */}
                    </div>

                        <div className='relative border border-gray-300 p-3'>
                            <button
                                onClick={prevReview}
                                className='absolute left-2 top-1/2 rounded-full -translate-y-1/2 bg-white border border-gray-300 p-2'>
                                <FaArrowLeft className='text-primary' />
                            </button>
                            <div>
                                <div className='flex justify-between items-center'>
                                    <p className='font-bold text-lg'>{reviews[currentReview].name}</p>
                                    <div className='flex text-yellow-500 mt-1 text-sm sm:text-base md:text-2xl'>
                                        {'★'.repeat(reviews[currentReview].rating)}
                                        {'☆'.repeat(5 - reviews[currentReview].rating)}
                                    </div>
                                </div>
                                <p className='text-gray-500 text-sm'>{reviews[currentReview].date}</p>
                                <p className='text-sm text-gray-700'>{reviews[currentReview].description}</p>
                            </div>
                            <button
                                onClick={nextReview}
                                className='absolute right-2 top-1/2 rounded-full -translate-y-1/2 bg-white border border-gray-300 p-2'>
                                <FaArrowRight className='text-primary' />
                            </button>
                        </div>
                </div>
            )}
        </div>
    );
}
