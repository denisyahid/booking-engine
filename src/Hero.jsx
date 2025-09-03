import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Hero() {
    const { slug } = useParams();
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/${slug}/room`)
            .then((res) => {
                setRooms(res.data);
            })
            .catch((err) => {});
    }, []);

    return (
        <div className='md:py-5 bg-white'>
            {/* HERO */}

            {/* ROOM CARDS */}
            <section className='max-w-6xl mx-auto py-4'>
                <h2 className='font-serif p-5 md:p-0 text-2xl md:text-3xl md:mb-8'>Latest Room Deals</h2>

                <div className='grid p-5 md:p-0 grid-cols-1 md:grid-cols-3 gap-8'>
                    {rooms.map((r, idx) => {
                        if (idx <= 2) {
                            return (
                                <article key={idx} className='bg-white'>
                                    <div className='relative overflow-hidden rounded'>
                                        {/* NOTE: replace paths /images/roomX.jpg with your real images */}
                                        <img src={r.image} alt={r.title} className='w-full h-48 md:h-48 object-cover rounded-t' />

                                        {/* <button className='absolute right-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded'>
                                    Book now
                                </button> */}
                                    </div>

                                    <div className='pt-4 p-4'>
                                        <h3 className='font-serif text-lg mb-2'>{r.name}</h3>
                                        <p className='text-sm text-gray-600 mb-4'>{r.description}</p>
                                        <hr className='border-t border-gray-200' />
                                    </div>
                                </article>
                            );
                        }
                    })}
                </div>
            </section>
        </div>
    );
}
