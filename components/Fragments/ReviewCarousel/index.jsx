import { useEffect, useState, useRef, useCallback } from 'react';
import { Star } from 'lucide-react';
import { contentAPI } from '../../../src/services/api';
import ErrorElement from '../../Elements/ErrorElement';

export default function ReviewCarousel({ slug }) {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef(null);
    const isPaused = useRef(false);
    const animationRef = useRef(null);
    const scrollPosition = useRef(0);

    // Fetch reviews from API
    useEffect(() => {
        setIsLoading(true);
        contentAPI.reviews(slug)
            .then((res) => {
                const mappedReviews = (res.data || []).map((review) => ({
                    id: review.id,
                    name: review.guest_name || 'Anonymous',
                    rating: review.rating || 0,
                    trip: review.trip_type || 'General',
                    description: review.review || '',
                    date: review.date || review.created_at || '',
                    avatar: review.avatar || null,
                }));
                setReviews(mappedReviews);
            })
            .catch(() => setReviews([]))
            .finally(() => setIsLoading(false));
    }, [slug]);

    // Smooth continuous scroll animation
    const animate = useCallback(() => {
        if (scrollRef.current && !isPaused.current) {
            scrollPosition.current += 0.5; // Kecepatan scroll (pixel per frame)
            
            // Reset scroll position untuk infinite loop
            if (scrollPosition.current >= scrollRef.current.scrollWidth / 2) {
                scrollPosition.current = 0;
            }
            
            scrollRef.current.scrollLeft = scrollPosition.current;
        }
        
        animationRef.current = requestAnimationFrame(animate);
    }, []);

    // Start/stop animation
    useEffect(() => {
        if (reviews.length > 0 && scrollRef.current) {
            animationRef.current = requestAnimationFrame(animate);
        }
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [reviews.length, animate]);

    // Pause on hover
    const handleMouseEnter = () => {
        isPaused.current = true;
    };

    const handleMouseLeave = () => {
        isPaused.current = false;
    };

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Static data untuk demo jika tidak ada review
    const staticReviews = [
        {
            id: 1,
            name: 'Ahmad Rizki',
            rating: 5,
            date: '2024-03-15',
            trip: 'Business Trip',
            description: 'Hotel yang sangat bagus! Pelayanan ramah, kamar bersih dan nyaman. Lokasi strategis dekat dengan pusat kota.',
            avatar: null
        },
        {
            id: 2,
            name: 'Siti Nurhaliza',
            rating: 4,
            date: '2024-03-10',
            trip: 'Family Vacation',
            description: 'Pengalaman menginap yang luar biasa. Fasilitas lengkap, sarapan enak. Anak-anak sangat senang!',
            avatar: null
        },
        {
            id: 3,
            name: 'Budi Santoso',
            rating: 5,
            date: '2024-03-05',
            trip: 'Romantic Getaway',
            description: 'Perfect untuk honeymoon! Pemandangan indah, suasana tenang dan romantis. Highly recommended!',
            avatar: null
        },
        {
            id: 4,
            name: 'Diana Putri',
            rating: 4,
            date: '2024-02-28',
            trip: 'Solo Traveling',
            description: 'Hotel yang nyaman dan aman untuk solo traveler. Staff sangat membantu dan friendly.',
            avatar: null
        },
        {
            id: 5,
            name: 'Eko Prasetyo',
            rating: 5,
            date: '2024-02-20',
            trip: 'Weekend Trip',
            description: 'Weekend yang sempurna! Pool area bagus, restoran enak, dan pelayanan top markotop!',
            avatar: null
        },
    ];

    const displayReviews = reviews.length > 0 ? reviews : staticReviews;
    const averageRating = displayReviews.length > 0
        ? displayReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / displayReviews.length
        : 0;

    // Duplicate reviews untuk infinite loop
    const infiniteReviews = [...displayReviews, ...displayReviews];

    if (isLoading) {
        return (
            <section className='w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                        <p className='mt-4 text-gray-600'>Loading reviews...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!Array.isArray(displayReviews)) return <ErrorElement />;

    return (
        <section className='w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12 md:py-16'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header Section */}
                <div className='mb-10'>
                    <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
                        Guest Reviews
                    </h2>
                    <p className='text-gray-600 text-lg'>
                        Lihat apa kata tamu yang telah menginap di hotel kami
                    </p>

                    {/* Rating Summary */}
                    <div className='mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border'>
                        <div className='flex items-center gap-4'>
                            <div className='text-5xl font-bold text-primary'>
                                {averageRating.toFixed(1)}
                            </div>
                            <div>
                                <div className='flex items-center gap-1 mb-1'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${
                                                star <= Math.round(averageRating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-300 text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className='text-sm text-gray-600'>
                                    Based on {displayReviews.length} reviews
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smooth Infinite Carousel */}
                <div 
                    ref={scrollRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className='overflow-hidden cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden'
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >

                    <div className='flex gap-6' style={{ width: 'max-content' }}>
                        {infiniteReviews.map((review, index) => (
                            <div
                                key={`${review.id}-${index}`}
                                className='w-80 md:w-96 flex-shrink-0'
                            >
                                <div className='bg-white rounded-xl shadow-md border border-gray-200 p-6 h-full
                                              hover:shadow-xl hover:border-blue-300 transition-all duration-300'>
                                    {/* Review Header */}
                                    <div className='flex items-start justify-between mb-4'>
                                        <div className='flex items-center gap-3'>
                                            {review.avatar ? (
                                                <img
                                                    src={review.avatar}
                                                    alt={review.name}
                                                    className='w-12 h-12 rounded-full object-cover border-2 border-gray-200'
                                                />
                                            ) : (
                                                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500
                                                              flex items-center justify-center text-white font-semibold text-lg'>
                                                    {review.name?.charAt(0) || 'G'}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className='font-semibold text-gray-900'>{review.name}</h4>
                                                <p className='text-xs text-gray-500'>{review.trip}</p>
                                            </div>
                                        </div>

                                        {/* Rating Badge */}
                                        <div className='bg-green-50 px-3 py-1 rounded-full'>
                                            <div className='flex items-center gap-1'>
                                                <Star className='w-4 h-4 fill-green-600 text-green-600' />
                                                <span className='text-sm font-semibold text-green-700'>
                                                    {review.rating?.toFixed(1) || '0.0'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stars */}
                                    <div className='flex gap-0.5 mb-3'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${
                                                    star <= review.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'fill-gray-300 text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Review Content */}
                                    <p className='text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4'>
                                        "{review.description}"
                                    </p>

                                    {/* Date */}
                                    <div className='pt-3 border-t border-gray-100'>
                                        <p className='text-xs text-gray-500'>
                                            Stayed on {formatDate(review.date)}
                                        </p>
                                    </div>

                                    {/* Verified Badge */}
                                    <div className='mt-3 flex items-center gap-1 text-xs text-blue-600'>
                                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                        </svg>
                                        <span>Verified Stay</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hint Text */}
                {displayReviews.length > 2 && (
                    <div className='text-center mt-6'>
                        <p className='text-sm text-gray-500 animate-pulse'>
                            ← Scroll otomatis, hover untuk pause →
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
