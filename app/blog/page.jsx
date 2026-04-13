'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { destinationAPI } from '../../src/services/api';
import { MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
    const router = useRouter();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        destinationAPI.list()
            .then((res) => {
                setDestinations(res.data || []);
            })
            .catch(() => {
                setError('Failed to load destinations');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                Loading destinations...
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 py-8 px-4'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex items-center gap-4 mb-6'>
                    <Link href='/destination' className='text-gray-600 hover:text-gray-800'>
                        <ArrowLeft className='w-5 h-5' />
                    </Link>
                    <h1 className='text-2xl font-bold text-gray-800'>Travel Guides & Tips</h1>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm'>
                        {error}
                    </div>
                )}

                {destinations.length === 0 ? (
                    <div className='bg-white rounded-lg shadow p-8 text-center'>
                        <MapPin className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                        <h2 className='text-xl font-semibold text-gray-700 mb-2'>No Destinations Available</h2>
                        <p className='text-gray-500'>
                            Check back later for travel guides and destination information.
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {destinations.map((dest) => (
                            <div key={dest.id} className='bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition'>
                                <div className='h-48 bg-gray-200 relative'>
                                    {dest.image_url ? (
                                        <img src={dest.image_url} alt={dest.name} className='w-full h-full object-cover' />
                                    ) : (
                                        <div className='w-full h-full flex items-center justify-center text-gray-400'>
                                            <MapPin className='w-12 h-12' />
                                        </div>
                                    )}
                                </div>
                                <div className='p-4'>
                                    <h3 className='font-semibold text-lg text-gray-800 mb-2'>{dest.name}</h3>
                                    <p className='text-sm text-gray-600 line-clamp-3 mb-3'>
                                        {dest.description || 'Explore beautiful destinations with NAJJ Hotels.'}
                                    </p>
                                    <Link
                                        href={`/destination/${dest.slug}`}
                                        className='text-primary font-semibold hover:underline'>
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
