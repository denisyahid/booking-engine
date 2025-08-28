import { ChevronDown } from 'lucide-react';





export default function App() {
    return (
        <div className='max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Testimonials */}
            <div>
                <h2 className='text-xl font-bold mb-4'>Client Testimonials</h2>
                <TestimonialsCarousel />
            </div>
        </div>
    );
}
