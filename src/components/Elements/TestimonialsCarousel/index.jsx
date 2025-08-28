import { useState } from 'react';
import { motion } from 'framer-motion';

const TestimonialsCarousel = () => {
    const [current, setCurrent] = useState(0);

    const testimonials = [
        {
            name: 'Diego Berry',
            role: 'happy buyer',
            text: 'Sed mattis pretium ligula quis egestas. Proin adipiscing ultricies tempor. Fusce faucibus felis ut odio ullamcorper in aliquam tortor sodales. Ut luctus nibh nec dui blandit quis laoreet libero facilisis.',
        },
        {
            name: 'Maria Smith',
            role: 'traveler',
            text: 'Amazing service and friendly staff! Definitely recommend this hotel.',
        },
        {
            name: 'John Doe',
            role: 'business guest',
            text: 'Perfect for business trips. Fast check-in and reliable WiFi.',
        },
    ];

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <div className='relative bg-gray-100 p-5 rounded-md shadow-sm'>
            <motion.p
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className='italic text-gray-700'>
                {testimonials[current].text}
            </motion.p>
            <div className='mt-3'>
                <span className='font-semibold text-gray-800'>{testimonials[current].name}</span>
                <span className='text-sm text-gray-500'> - {testimonials[current].role}</span>
            </div>
            <div className='absolute top-1/2 -translate-y-1/2 left-2 flex gap-2'>
                <button onClick={prev} className='p-2 rounded-full bg-white shadow hover:bg-gray-200'>
                    ◀
                </button>
            </div>
            <div className='absolute top-1/2 -translate-y-1/2 right-2 flex gap-2'>
                <button onClick={next} className='p-2 rounded-full bg-white shadow hover:bg-gray-200'>
                    ▶
                </button>
            </div>
        </div>
    );
};

export default TestimonialsCarousel;
