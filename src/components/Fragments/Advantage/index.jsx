import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorElement from '../../Elements/ErrorElement/index';

const Advantage = () => {
    const [advantages, setAdvantages] = useState([]);
    const { slug } = useParams();

    useEffect(() => {
        // contoh fetch dari API
        axios.get(`http://127.0.0.1:8000/api/advantage/${slug}`).then((res) => {
            setAdvantages(res.data.hotel_advantage);
            console.log(res.data.hotel_advantage);
        });
    }, []);

    if (!advantages) return <ErrorElement />;

    return (
        advantages.length > 0 && (
            <section className='w-full max-w-6xl mx-auto px-4 py-8'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Serunya Nginap di Sini</h2>

                <div className='w-full grid gap-4 sm:grid-cols-2 md:grid-cols-4'>
                    {advantages.map((item) => (
                        <div key={item.id} className=' flex flex-col h-[15rem] border items-center justify-center text-center gap-3 bg-white shadow p-4'>
                            <span className='text-3xl'>{item.icon}</span>
                            <div>
                                <h3 className='font-semibold text-gray-800'>{item.name}</h3>
                                <p className='text-gray-600 text-sm'>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )
    );
};

export default Advantage;
