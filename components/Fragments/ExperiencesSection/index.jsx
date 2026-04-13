'use client';

import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Play } from 'lucide-react'; // ikon play
import Link from 'next/link';

// 🔹 Komponen video card terpisah
function VideoCard({ videoSrc,slug,image }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className='relative w-full aspect-square bg-gray-200 overflow-hidden shadow-sm'>
            <img className='w-full h-full object-cover' src={image} alt='' />
            <video ref={videoRef} className='w-full h-full object-cover' src={videoSrc} controls={false} />
            {!isPlaying && (
                <Link href={`/destination/${slug}`} className='absolute inset-0 flex items-center justify-center'>
                </Link>
            )}
        </div>
    );
}

export default function ExperiencesSection({ destinations = [], slug }) {
    const [visibleCount] = useState(6);

    // Filter only destinations (is_nearby == false or 0, OR has slug)
    const experiences = destinations.filter((d) => {
        // If it has a slug and name, it's a destination (experience)
        if (d.slug && d.name) return true;
        // If is_nearby is explicitly false/0, include it
        if (d.is_nearby === false || d.is_nearby === 0) return true;
        return false;
    });

    console.log('🎯 ExperiencesSection - All destinations:', destinations);
    console.log('🎯 Filtered experiences:', experiences);

    if (!destinations || destinations.length === 0) {
        console.log('⚠️ No destinations data provided');
        return null;
    }

    if (experiences.length === 0) {
        console.log('⚠️ No experiences found after filtering');
        return null;
    }

    return (
        <section className='w-full max-w-6xl mx-auto py-8'>
            {/* Header */}
            <div className='flex items-center justify-between py-8 mb-4'>
                <h2 className='text-lg md:text-xl font-semibold text-gray-800'>Experiences waiting for you</h2>
                <Link href={`/destination`} className='text-blue-600 text-md font-medium hover:underline'>
                    Lihat semua
                </Link>
            </div>

            {/* Grid Items */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3'>
                {experiences.slice(0, visibleCount).map((item, idx) => {
                    const firstImage = item.destination_image && item.destination_image.length > 0 
                        ? item.destination_image[0].image 
                        : null;
                    
                    return (
                        <Link 
                            href={`/destination/${item.slug}`} 
                            key={idx} 
                            className='relative w-full aspect-square bg-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group'
                        >
                            {firstImage ? (
                                <img 
                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                                    src={firstImage} 
                                    alt={item.name} 
                                />
                            ) : (
                                <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
                                    <span className='text-gray-500 text-xs text-center px-2'>{item.name}</span>
                                </div>
                            )}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                            <div className='absolute bottom-0 left-0 right-0 p-2'>
                                <p className='text-white text-xs font-medium truncate'>{item.name}</p>
                                {item.rating > 0 && (
                                    <p className='text-yellow-400 text-xs'>★ {item.rating}</p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
