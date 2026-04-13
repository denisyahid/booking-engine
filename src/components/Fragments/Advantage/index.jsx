import { useEffect, useState } from 'react';
import ErrorElement from '../../Elements/ErrorElement/index';
import { contentAPI } from '../../../services/api';

const Advantage = ({slug}) => {
    const [advantages, setAdvantages] = useState([]);

    useEffect(() => {
        // contoh fetch dari API
        contentAPI.advantages(slug)
            .then((res) => {
                setAdvantages(res.data.advantage);
            })
            .catch(() => {
                setAdvantages([]);
            });
    }, [slug]);

    if (!advantages) return <ErrorElement />;

    return (
        advantages.length > 0 && (
            <section className='w-full max-w-6xl mx-auto px-4 py-8 md:my-10'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Serunya Nginap di Sini</h2>

                <div className='w-full grid gap-4 sm:grid-cols-2 md:grid-cols-4'>
                    {advantages.map((item) => (
                        <div key={item.id} className=' flex flex-col h-[12rem] border items-center justify-center text-center gap-3 bg-white shadow p-4'>
                            <span className='text-4xl'>{item.icon}</span>
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
