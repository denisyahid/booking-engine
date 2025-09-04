import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ images = [], name, roomId }) => {
    const [current, setCurrent] = useState(0);

    if (images.length === 0) {
        console.log('fwfwa')
        return <img src='https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt={name} className='w-full h-64 md:h-80 object-cover rounded-xl' />;
    }

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className='relative w-full h-64 md:h-80 overflow-hidden rounded-xl'>
            {/* Images */}
            <div className='flex transition-transform duration-500 ease-in-out' style={{ transform: `translateX(-${current * 100}%)` }}>
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img.image ? `http://127.0.0.1:8000/storage/${img.image}` : 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                        alt={`${name}-${idx}`}
                        className='w-full h-64 md:h-80 object-cover flex-shrink-0'
                    />
                ))}
            </div>

            {/* Navigation */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className='absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full'>
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className='absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full'>
                        <ChevronRight size={20} />
                    </button>
                </>
            )}

            {/* Indicators */}
            {images.length > 1 && (
                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2'>
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`w-2 h-2 rounded-full ${idx === current ? 'bg-white' : 'bg-gray-400'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;
