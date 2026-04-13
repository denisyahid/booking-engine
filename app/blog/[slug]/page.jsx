'use client';

import { useEffect, useState, use } from 'react';
import { destinationAPI } from '../../../src/services/api';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function BlogDetailPage({ params }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (slug) {
            destinationAPI.detail(slug)
                .then((res) => {
                    setDestination(res.data);
                })
                .catch(() => {
                    setError('Failed to load destination details');
                })
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                Loading destination...
            </div>
        );
    }

    if (error || !destination) {
        return (
            <div className='min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4'>
                <div className='max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-4'>Destination Not Found</h1>
                    <p className='text-gray-600 mb-6'>
                        The destination you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link href='/blog' className='text-primary font-semibold hover:underline'>
                        ← Back to Destinations
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 py-8 px-4'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex items-center gap-4 mb-6'>
                    <Link href='/blog' className='text-gray-600 hover:text-gray-800'>
                        <ArrowLeft className='w-5 h-5' />
                    </Link>
                    <h1 className='text-3xl font-bold text-gray-800'>{destination.name}</h1>
                </div>

                <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                    {/* Hero Image */}
                    <div className='h-64 md:h-96 bg-gray-200'>
                        {destination.image_url ? (
                            <img src={destination.image_url} alt={destination.name} className='w-full h-full object-cover' />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center text-gray-400'>
                                <MapPin className='w-24 h-24' />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className='p-6 md:p-8'>
                        <div className='prose max-w-none'>
                            <p className='text-gray-700 leading-relaxed text-lg'>
                                {destination.description || 'No description available for this destination.'}
                            </p>
                        </div>

                        <div className='mt-8 pt-6 border-t'>
                            <Link
                                href='/destination'
                                className='inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition'>
                                Find Hotels Near This Destination
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
