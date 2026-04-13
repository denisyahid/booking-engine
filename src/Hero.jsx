import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Hero({ rooms, roomImages }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const allRooms = rooms.length > 0 ? rooms : [];

    // Carousel auto-slide every 5 seconds
    useEffect(() => {
        if (allRooms.length > 3) {
            const interval = setInterval(() => {
                handleNext();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [allRooms, currentIndex]);

    const handleNext = () => {
        if (isTransitioning || allRooms.length <= 3) return;
        setIsTransitioning(true);
        if (currentIndex + 3 >= allRooms.length) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const handlePrev = () => {
        if (isTransitioning || allRooms.length <= 3) return;
        setIsTransitioning(true);
        if (currentIndex === 0) {
            setCurrentIndex(Math.max(0, allRooms.length - 3));
        } else {
            setCurrentIndex((prev) => prev - 1);
        }
        setTimeout(() => setIsTransitioning(false), 600);
    };

    // Get room image
    const getRoomImage = (room) => {
        let images = room.images || [];
        if (images.length === 0 && roomImages) {
            images = roomImages.filter((image) => image.room_id === room.id);
        }
        if (images.length > 0) {
            return images[0].url || images[0].image;
        }
        return room.cover_image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop';
    };

    const formatRupiah = (num) => {
        return 'Rp ' + Number(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    if (rooms.length === 0) return null;

    return (
        <div className='bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header Section */}
                <div className='text-center mb-8'>
                    <h2 className='font-sans text-2xl md:text-3xl font-semibold text-gray-800'>
                        Latest Room Deals
                    </h2>
                </div>

                {/* Carousel Container */}
                <div className='relative'>
                    {/* Navigation Arrows */}
                    {allRooms.length > 3 && (
                        <>
                            <button
                                onClick={handlePrev}
                                disabled={isTransitioning}
                                className='absolute left-0 top-1/2 -translate-y-1/2 z-20 -translate-x-4
                                           bg-white/90 hover:bg-white text-gray-700 p-3 shadow-lg
                                           border border-gray-200 transition-all duration-300
                                           disabled:opacity-50 disabled:cursor-not-allowed'>
                                <FaChevronLeft size={18} />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isTransitioning}
                                className='absolute right-0 top-1/2 -translate-y-1/2 z-20 translate-x-4
                                           bg-white/90 hover:bg-white text-gray-700 p-3 shadow-lg
                                           border border-gray-200 transition-all duration-300
                                           disabled:opacity-50 disabled:cursor-not-allowed'>
                                <FaChevronRight size={18} />
                            </button>
                        </>
                    )}

                    {/* Cards Grid with Smooth Slide Transition */}
                    <div className='overflow-hidden'>
                        <div
                            className='flex transition-transform duration-600 ease-in-out'
                            style={{
                                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                                width: `${(allRooms.length / 3) * 100}%`,
                            }}
                        >
                            {allRooms.map((room) => {
                                const originalPrice = room.original_rate || room.rate || 0;
                                const discountPrice = room.rate || 0;
                                const hasDiscount = room.has_discount && originalPrice > discountPrice;
                                const discountPercent = room.discount_percent || 0;

                                return (
                                    <div
                                        key={room.id}
                                        className='px-3'
                                        style={{ width: `${100 / allRooms.length}%` }}
                                    >
                                        <article
                                            className='group bg-white rounded-lg border border-gray-200 hover:border-blue-400
                                                       transition-all duration-300 hover:shadow-lg cursor-pointer h-full'>
                                            {/* Image Section */}
                                            <div className='relative h-56 overflow-hidden rounded-t-lg'>
                                                <img
                                                    loading='lazy'
                                                    src={getRoomImage(room)}
                                                    alt={room.name || 'Room'}
                                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                                />

                                                {/* Discount Badge */}
                                                {hasDiscount && (
                                                    <div className='absolute top-3 left-3'>
                                                        <div className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide'>
                                                            🔥 {Math.round(discountPercent)}% OFF
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Section */}
                                            <div className='p-5'>
                                                {/* Room Name */}
                                                <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors'>
                                                    {room.name}
                                                </h3>

                                                {/* Description */}
                                                {room.description && (
                                                    <p className='text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed'>
                                                        {room.description}
                                                    </p>
                                                )}

                                                {/* Price & CTA */}
                                                <div className='pt-4 border-t border-gray-100'>
                                                    <div className='flex items-end justify-between'>
                                                        <div>
                                                            <p className='text-xs text-gray-500 mb-1 uppercase'>Mulai dari</p>
                                                            {hasDiscount ? (
                                                                <div className='flex items-center gap-2'>
                                                                    <p className='text-base text-gray-400 line-through'>
                                                                        {formatRupiah(originalPrice)}
                                                                    </p>
                                                                    <p className='text-xl font-bold text-red-600'>
                                                                        {formatRupiah(discountPrice)}
                                                                    </p>
                                                                    <span className='text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-semibold'>
                                                                        -{Math.round(discountPercent)}%
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <p className='text-xl font-bold text-blue-600'>
                                                                    {formatRupiah(discountPrice)}
                                                                </p>
                                                            )}
                                                            <p className='text-xs text-gray-500'>/malam</p>
                                                        </div>

                                                        <div className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-semibold text-sm uppercase tracking-wide transition-colors duration-200'>
                                                            Detail
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
