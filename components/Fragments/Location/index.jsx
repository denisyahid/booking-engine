import {  Utensils, Landmark, Mountain,Coffee } from 'lucide-react';
import ErrorElement from '../../Elements/ErrorElement';
import ExperiencesSection from '../ExperiencesSection';

export default function LocationSection({hotel,slug,destinations}) {
    // Use destinations from props (passed from parent) to avoid double API call
    // Parent component (HotelPage) already fetches this data
    const nearby = destinations ? destinations.filter(d => d.is_nearby === true) : [];


    const iconMap = {
        utensils: <Utensils className='w-4 h-4 text-orange-500' />,
        coffee: <Coffee className='w-4 h-4 text-brown-500' />,
        landmark: <Landmark className='w-4 h-4 text-blue-500' />,
        mountain: <Mountain className='w-4 h-4 text-green-500' />,
    };

    if (!hotel || !hotel.maps) return <ErrorElement />;

    return (
        <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:my-20'>
            <h2 className='text-xl sm:text-2xl font-semibold mb-4'>Lokasi</h2>

            {/* Map + Info */}
            <div className='flex flex-col lg:flex-row-reverse gap-6'>
                {/* Map */}
                {hotel && (
                    <div className='flex-1'>
                        <iframe
                            title='map'
                            src={`${hotel.maps}`}
                            className='w-full h-64 sm:h-80 lg:h-full shadow'
                            allowFullScreen=''
                            loading='lazy'></iframe>
                    </div>
                )}

                {/* Info Lokasi */}
                <div className='lg:w-1/3 space-y-4'>
                    {/* Alamat */}
                    <div>
                        <p className='text-gray-700'>{hotel.location}</p>
                    </div>

                    {/* Destinasi Terdekat */}
                    {nearby.length > 0 && (
                        <div>
                            <h3 className='font-semibold mb-2'>Destinasi Terdekat</h3>
                            <div className='space-y-3'>
                                {nearby.slice(0,3).map((item, idx) => (
                                    <a
                                        href='#'
                                        key={idx}
                                        className='flex border items-center justify-between bg-white shadow p-3 hover:bg-gray-50 transition'>
                                        <div className='flex items-center gap-2'>
                                            {iconMap[item.icon]}
                                            <div className='ms-2'>
                                                <p className='text-sm font-medium'>{item.name}</p>
                                                <p className='text-xs text-gray-500'>{item.type}</p>
                                            </div>
                                        </div>
                                        <span className='text-sm font-semibold text-gray-700'>{item.distance}</span>
                                    </a>
                                ))}
                            </div>
                            <p className='text-xs text-gray-500 mt-2'>
                                Jarak di atas dihitung berdasarkan garis lurus. Jarak perjalanan sebenarnya mungkin berbeda.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <ExperiencesSection destinations={destinations} />
        </div>
    );
}
