import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Import semua icon yang mungkin dipakai
import { Waves, Wifi, Baby, Sofa, Calendar, Flame, Tent, Wind, Coffee, Bath } from 'lucide-react';
import ErrorElement from '../../Elements/ErrorElement';

// Mapping nama string dari API → komponen icon
const iconMap = {
    Waves: Waves,
    Wifi: Wifi,
    Baby: Baby,
    Sofa: Sofa,
    Calendar: Calendar,
    Flame: Flame,
    Tent: Tent,
    Wind: Wind,
    Coffee: Coffee,
    Bath: Bath,
};

export default function HotelFacilities() {
    const [facilities, setFacilities] = useState([]);
    const { slug } = useParams();

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/${slug}/facilities`)
            .then((res) => setFacilities(res.data.hotel_facilities))
            .catch((err) => console.error(err));
    }, [slug]);

    if(!facilities) return <ErrorElement />;

    return (
        facilities.length > 0 && (
            <section className='w-full max-w-6xl mx-auto px-4 py-8'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Fasilitas Populer</h2>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {facilities.map((facility) => {
                        const IconComponent = iconMap[facility.icon] || Wifi; // fallback ke Wifi kalau icon tidak ditemukan
                        return (
                            <div key={facility.id} className='flex items-center gap-3 bg-white shadow p-4 hover:shadow-md transition'>
                                <IconComponent className='w-6 h-6 text-gray-700' />
                                <p className='text-gray-700 font-medium'>{facility.name}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        )
    );
}
