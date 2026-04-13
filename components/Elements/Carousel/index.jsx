import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Carousel = ({ images = [], name, height = 80 }) => {
    const [current, setCurrent] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [direction, setDirection] = useState('next');

    if (images.length === 0) {
        return (
            <img
                src='https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop'
                alt={name}
                className='w-full h-64 md:h-80 object-cover'
            />
        );
    }

    const prevSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setDirection('prev');
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 700);
    }, [images.length, isTransitioning]);

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setDirection('next');
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsTransitioning(false), 700);
    }, [images.length, isTransitioning]);

    const goToSlide = useCallback((index) => {
        if (isTransitioning || index === current) return;
        setIsTransitioning(true);
        setDirection(index > current ? 'next' : 'prev');
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 700);
    }, [current, isTransitioning]);

    // Auto-play dengan interval lebih lama untuk kenyamanan
    useEffect(() => {
        if (images.length <= 1) return;
        
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // 5 detik agar lebih nyaman

        return () => clearInterval(interval);
    }, [images.length, nextSlide]);

    return (
        <>
            {/* Carousel Container */}
            <div className='relative w-full h-64 md:h-80 overflow-hidden group'>
                {/* Background blur effect untuk smooth transition */}
                <div 
                    className='absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out'
                    style={{
                        backgroundImage: `url(${images[current].image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop'})`,
                        filter: 'blur(20px) brightness(0.7)',
                        transform: 'scale(1.1)',
                    }}
                />

                {/* Images dengan fade + slide effect */}
                <div className='relative w-full h-full'>
                    {images.map((img, idx) => {
                        const isActive = idx === current;
                        const isNext = (idx === (current + 1) % images.length);
                        
                        return (
                            <div
                                key={idx}
                                className='absolute inset-0 transition-all duration-700 ease-in-out'
                                style={{
                                    opacity: isActive ? 1 : 0,
                                    transform: isActive 
                                        ? 'translateX(0) scale(1)' 
                                        : direction === 'next'
                                            ? isNext 
                                                ? 'translateX(0) scale(1)'
                                                : 'translateX(-100%) scale(0.95)'
                                            : idx === (current - 1 + images.length) % images.length
                                                ? 'translateX(0) scale(1)'
                                                : 'translateX(100%) scale(0.95)',
                                    zIndex: isActive ? 10 : 5,
                                }}
                            >
                                <img
                                    loading='lazy'
                                    src={
                                        img.image
                                            ? `${img.image}`
                                            : 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop'
                                    }
                                    alt={`${name}-${idx}`}
                                    className='w-full h-full object-cover object-bottom cursor-pointer'
                                    onClick={() => setShowPopup(true)}
                                />
                                
                                {/* Gradient overlay untuk depth */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Buttons dengan hover effect */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            disabled={isTransitioning}
                            className='absolute top-1/2 left-4 -translate-y-1/2 z-20
                                       bg-white/20 backdrop-blur-md hover:bg-white/40
                                       text-white p-3 rounded-full opacity-0 group-hover:opacity-100
                                       transition-all duration-300 hover:scale-110
                                       disabled:opacity-0 disabled:cursor-not-allowed
                                       shadow-lg hover:shadow-xl'>
                            <ChevronLeft size={20} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={isTransitioning}
                            className='absolute top-1/2 right-4 -translate-y-1/2 z-20
                                       bg-white/20 backdrop-blur-md hover:bg-white/40
                                       text-white p-3 rounded-full opacity-0 group-hover:opacity-100
                                       transition-all duration-300 hover:scale-110
                                       disabled:opacity-0 disabled:cursor-not-allowed
                                       shadow-lg hover:shadow-xl'>
                            <ChevronRight size={20} strokeWidth={2.5} />
                        </button>
                    </>
                )}

                {/* Progress Bar untuk auto-play */}
                {images.length > 1 && (
                    <div className='absolute bottom-0 left-0 right-0 h-1 bg-black/20'>
                        <div 
                            key={current}
                            className='h-full bg-white/80'
                            style={{
                                animation: 'progressBar 5s linear',
                            }}
                        />
                    </div>
                )}

                {/* Indicators dengan animasi */}
                {images.length > 1 && (
                    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                disabled={isTransitioning}
                                className={`relative overflow-hidden transition-all duration-500 rounded-full
                                          ${idx === current 
                                              ? 'w-8 h-2 bg-white shadow-lg' 
                                              : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                                          }
                                          disabled:cursor-not-allowed`}
                            />
                        ))}
                    </div>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                    <div className='absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full z-20'>
                        {current + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Popup Modal dengan smooth animation */}
            {showPopup && (
                <div 
                    className='fixed inset-0 z-50 flex items-center justify-center'
                    onClick={() => setShowPopup(false)}
                >
                    {/* Backdrop dengan fade */}
                    <div 
                        className='absolute inset-0 bg-black/90 backdrop-blur-sm'
                        style={{ animation: 'fadeIn 0.3s ease-out' }}
                    />
                    
                    {/* Image container */}
                    <div 
                        className='relative max-w-4xl w-full mx-4'
                        style={{ animation: 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            loading='lazy'
                            src={
                                images[current].image
                                    ? `${images[current].image}`
                                    : 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop'
                            }
                            alt={name}
                            className='w-full max-h-[85vh] object-contain rounded-lg shadow-2xl'
                        />
                        
                        {/* Close button */}
                        <button
                            onClick={() => setShowPopup(false)}
                            className='absolute -top-4 -right-4 bg-white hover:bg-gray-100 
                                       text-gray-800 p-2.5 rounded-full shadow-xl
                                       transition-all duration-300 hover:scale-110 hover:rotate-90'>
                            <X size={24} strokeWidth={2.5} />
                        </button>

                        {/* Navigation dalam popup */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevSlide();
                                    }}
                                    className='absolute left-4 top-1/2 -translate-y-1/2 
                                               bg-white/20 backdrop-blur-md hover:bg-white/40
                                               text-white p-3 rounded-full transition-all duration-300 
                                               hover:scale-110 shadow-lg'>
                                    <ChevronLeft size={24} strokeWidth={2.5} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextSlide();
                                    }}
                                    className='absolute right-4 top-1/2 -translate-y-1/2 
                                               bg-white/20 backdrop-blur-md hover:bg-white/40
                                               text-white p-3 rounded-full transition-all duration-300 
                                               hover:scale-110 shadow-lg'>
                                    <ChevronRight size={24} strokeWidth={2.5} />
                                </button>
                            </>
                        )}

                        {/* Thumbnail indicators */}
                        {images.length > 1 && (
                            <div className='absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2'>
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goToSlide(idx);
                                        }}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300
                                                  ${idx === current ? 'border-white scale-110 shadow-lg' : 'border-white/30 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={img.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop'}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className='w-full h-full object-cover'
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CSS Animations - Global */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes progressBar {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </>
    );
};

export default Carousel;
