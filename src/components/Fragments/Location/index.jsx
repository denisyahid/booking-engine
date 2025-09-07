import axios from 'axios';
import { MapPin, Utensils, Landmark, Mountain } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorElement from '../../Elements/ErrorElement';

export default function LocationSection() {
    const [hotel, setHotel] = useState({});
    const { slug } = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/hotel/${slug}`).then((res) => {
            setHotel(res.data);
        });
    }, []);

    const nearby = [
        {
            name: 'Kintamani Coffee - Eco Bike Coffee',
            type: 'Restoran',
            icon: <Utensils className='w-4 h-4 text-orange-500' />,
            distance: '28m',
        },
        {
            name: 'Bali Trekking Guide And Tour',
            type: 'Landmark lain',
            icon: <Landmark className='w-4 h-4 text-green-600' />,
            distance: '1.4km',
        },
        {
            name: 'Mount Batur View Point',
            type: 'Atraksi lain',
            icon: <Mountain className='w-4 h-4 text-purple-600' />,
            distance: '2.7km',
        },
    ];

    // console.log(hotel)

    if (!hotel || !hotel.maps) return <ErrorElement />;

    return (
        <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:my-10'>
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
                    <div>
                        <h3 className='font-semibold mb-2'>Destinasi Terdekat</h3>
                        <div className='space-y-3'>
                            {nearby.map((item, idx) => (
                                <div
                                    key={idx}
                                    className='flex items-center justify-between bg-white shadow p-3 hover:bg-gray-50 transition'>
                                    <div className='flex items-center gap-2'>
                                        {item.icon}
                                        <div>
                                            <p className='text-sm font-medium'>{item.name}</p>
                                            <p className='text-xs text-gray-500'>{item.type}</p>
                                        </div>
                                    </div>
                                    <span className='text-sm font-semibold text-gray-700'>{item.distance}</span>
                                </div>
                            ))}
                        </div>
                        <p className='text-xs text-gray-500 mt-2'>
                            Jarak di atas dihitung berdasarkan garis lurus. Jarak perjalanan sebenarnya mungkin berbeda.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
