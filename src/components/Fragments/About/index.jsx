import { useEffect, useState } from 'react';
import ErrorElement from '../../Elements/ErrorElement';
import axios from 'axios';

export default function AboutSection({ title, description }) {
    const [expanded, setExpanded] = useState(false);
    const [hotel, setHotel] = useState({});

    // useEffect(() => {
    //     axios.get(`http://127.0.0.1:8000/api/hotel/${slug}`).then((res) => {
    //         setHotel(res.data);
    //     });
    // }, []);

    // const shortText = description.slice(0, 220) + '...';

    if (!title) return <ErrorElement />

    return (
        <section className='w-full max-w-6xl border mx-auto px-4 py-8 md:my-10'>
            <h2 className='text-2xl md:text-3xl font-semibold text-gray-800 mb-4'>Tentang {title}</h2>

            <p className='text-gray-600 leading-relaxed text-justify'>{expanded ? description : description.substring(0,220) + "..."}</p>

            <button onClick={() => setExpanded(!expanded)} className='mt-3 text-blue-600 font-medium hover:underline focus:outline-none'>
                {expanded ? 'Sembunyikan' : 'Selengkapnya'}
            </button>
        </section>
    );
}
