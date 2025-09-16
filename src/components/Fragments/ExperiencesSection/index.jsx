import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ExperiencesSection({ items = [] }) {
    const [visibleCount] = useState(5); // tampilkan hanya 5 item
    const [destination,setDestination] = useState([]);
    const {slug} = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/nearby`)
        .then((res) => {
            setDestination(res.data)
            console.log(res.data)
        })
    },[])

    return (
        <section className='w-full max-w-6xl mx-auto py-8'>
            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg md:text-xl font-semibold text-gray-800'>Experiences waiting for you</h2>
                <a href='#' className='text-blue-600 text-sm font-medium hover:underline'>
                    Lihat semua
                </a>
            </div>

            {/* Grid Items */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3'>
                {destination.length > 0 && destination
                .filter((nearby) => nearby.is_nearby == false)
                .slice(0, visibleCount).map((item, idx) => (
                    <div key={idx} className='w-full aspect-square bg-gray-200 overflow-hidden shadow-sm'>
                        <video className='w-full h-full object-cover' src={item.video} ></video>
                    </div>
                ))}
            </div>
        </section>
    );
}
