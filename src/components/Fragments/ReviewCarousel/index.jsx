import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewSummary from '../../Elements/ReviewSummary';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ErrorElement from '../../Elements/ErrorElement';

export default function ReviewCarousel() {
    const [reviews, setReviews] = useState([]);
    const [current, setCurrent] = useState(0);
    const itemsPerSlide = 2; // tampilkan 2 review per slide
    const { slug } = useParams();

    function getDayName(dateString) {
        // Pastikan input adalah string dalam format YYYY-MM-DD
        if (!dateString || typeof dateString !== 'string') {
            return 'Invalid Date';
        }

        // Buat objek Date dari string
        const dateObject = new Date(dateString);

        // Jika tanggal tidak valid (misal: '2025-02-30')
        if (isNaN(dateObject.getTime())) {
            return 'Invalid Date';
        }

        // Opsi untuk nama hari panjang
        const options = { weekday: 'long' };

        // Dapatkan nama hari dalam bahasa Indonesia
        const dayName = new Intl.DateTimeFormat('id-ID', options).format(dateObject);

        return dayName;
    }

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/review`).then((res) => {
            setReviews(res.data.review);
        });
    }, []);

    const nextSlide = () => {
        setCurrent((prev) => (prev + itemsPerSlide >= reviews.length ? 0 : prev + itemsPerSlide));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - itemsPerSlide < 0 ? reviews.length - itemsPerSlide : prev - itemsPerSlide));
    };

    if(!reviews) return <ErrorElement />;

    return (
        reviews.length > 0 && (
            <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <h2 className='text-xl sm:text-2xl font-semibold mb-6 text-center sm:text-left'>Review</h2>

                <ReviewSummary
                    average={reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0}
                    total={reviews.length}
                />

                <div className='relative flex items-center'>
                    {/* Tombol Kiri */}
                    <button
                        onClick={prevSlide}
                        className='hidden sm:flex absolute -left-12 top-1/2 -translate-y-1/2 z-10 
               p-2 bg-gray-200 rounded-full hover:bg-gray-300 shadow'>
                        <ChevronLeft className='w-5 h-5' />
                    </button>

                    {/* Review List */}
                    <div className='flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 transition-transform duration-500 ease-in-out'>
                        {reviews.slice(current, current + itemsPerSlide).map((review) => (
                            <div key={review.id} className='bg-white shadow-md border p-4 sm:p-6'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                                    <p className='font-medium text-base sm:text-lg'>{review.name}</p>
                                    <p className='text-xs sm:text-sm text-gray-500'>{getDayName(review.date) + ' ' + review.date}</p>
                                </div>
                                <p className='text-sm text-gray-500 mt-1'>{review.trip}</p>
                                <div className='flex text-yellow-500 mt-1 text-sm sm:text-base'>
                                    {'★'.repeat(review.rating)}
                                    {'☆'.repeat(5 - review.rating)}
                                </div>
                                <p className='mt-3 text-gray-700 text-sm sm:text-base leading-relaxed'>{review.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tombol Kanan */}
                    <button
                        onClick={nextSlide}
                        className='hidden sm:flex absolute -right-12 top-1/2 -translate-y-1/2 z-10 
               p-2 bg-gray-200 rounded-full hover:bg-gray-300 shadow'>
                        <ChevronRight className='w-5 h-5' />
                    </button>
                </div>

                {/* Indikator Bulat */}
                <div className='flex justify-center mt-6 space-x-2'>
                    {Array.from({ length: Math.ceil(reviews.length / itemsPerSlide) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index * itemsPerSlide)}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                                current / itemsPerSlide === index ? 'bg-gray-800' : 'bg-gray-400'
                            }`}></button>
                    ))}
                </div>
            </div>
        )
    );
}
