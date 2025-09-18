import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    FaSwimmingPool,
    FaWifi,
    FaChild,
    FaCouch,
    FaCalendarAlt,
    FaFire,
    FaMountain,
    FaCoffee,
    FaBath,
    FaUtensils,
    FaDoorOpen,
    FaCar,
    FaBan,
    FaBicycle,
    // FaBycycle,
} from 'react-icons/fa';

export default function Facilities({slug}) {
    const [showAll, setShowAll] = useState(false);
    const [facilities, setFacilities] = useState([]);
    const [facilityCategories, setFacilityCategories] = useState([]);

    // Mapping icon string → komponen react-icons
    const iconMap = {
        FaSwimmingPool: <FaSwimmingPool />,
        FaBicycle: <FaBicycle />,
        FaWifi: <FaWifi />,
        FaChild: <FaChild />,
        FaCouch: <FaCouch />,
        FaCalendarAlt: <FaCalendarAlt />,
        FaFire: <FaFire />,
        FaMountain: <FaMountain />,
        FaCoffee: <FaCoffee />,
        FaBath: <FaBath />,
        FaUtensils: <FaUtensils />,
        FaDoorOpen: <FaDoorOpen />,
        FaCar: <FaCar />,
        FaBan: <FaBan />,
    };

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/facilities`).then((res) => {
            setFacilities(res.data.hotel_facilities);
        });
    }, []);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/facilities/categories`).then((res) => {
            setFacilityCategories(res.data);
        });
    }, []);

    return (
        <div className='max-w-6xl mx-auto bg-white p-6 shadow my-6 md:my-10 md:py-10'>
            <h2 className='text-xl font-semibold mb-4'>Fasilitas Populer</h2>

            {/* Populer */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                {facilities
                    .filter((facility) => facility.is_popular == true)
                    .slice(0, showAll ? facilities.length : 8)
                    .map((item, idx) => (
                        <div key={idx} className='flex items-center gap-3 text-gray-700 border p-4 shadow-sm'>
                            <span className='text-primary text-lg'>{iconMap[item.icon] ?? '❓'}</span>
                            <span className='text-sm md:text-base font-medium'>{item.name}</span>
                        </div>
                    ))}
            </div>

            {/* Tombol Lihat Semua */}
            <button className='mt-4 text-primary font-semibold text-sm md:text-base' onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Tutup' : 'Lihat semua'}
            </button>

            {/* Detail */}
            {showAll && (
                <div className='mt-6 space-y-6'>
                    {Object.entries(facilityCategories).map(([category, items], idx) => (
                        <div key={idx}>
                            <h3 className='font-semibold text-gray-800 mb-2'>
                                {category} <span className='text-sm text-gray-500'>({items.length})</span>
                            </h3>
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-gray-600'>
                                {items.map((f, i) => (
                                    <span key={i} className='text-sm md:text-base'>
                                        {f}
                                    </span>
                                ))}
                            </div>
                            <hr className='mt-4' />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
