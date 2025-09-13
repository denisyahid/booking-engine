import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ErrorElement from '../../Elements/ErrorElement';

export default function Policies() {
    const [policies, setPolicies] = useState([]);
    const { slug } = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/policies`).then((res) => {
            setPolicies(res.data.policies);
        });
    }, [slug]);

    if (!policies) return <ErrorElement />;

    return (
        policies.length > 0 && (
            <div className='max-w-6xl mx-auto p-6 md:my-20 bg-gray-50 shadow-sm border'>
                <h2 className='text-2xl font-bold mb-8 text-gray-800 border-b pb-3'>Kebijakan Akomodasi</h2>

                {policies.map((policyGroup, idx) => (
                    <div key={idx} className='mb-10'>
                        <h3 className='text-lg font-semibold mb-4 text-primary flex items-center gap-2'>
                            {policyGroup.type}
                        </h3>

                        <div className='space-y-4'>
                            {policyGroup.items.map((item, i) => (
                                <div key={i} className='grid grid-cols-3 items-start bg-white shadow px-4 py-3 border-y'>
                                    {item.title && (
                                        <span className='font-medium text-gray-700 flex items-center gap-2'>
                                            {item.title === 'Check-in ' && ' 🕑'}
                                            {item.title === 'Check-out ' && ' 🕚'}
                                            {item.title}
                                        </span>
                                    )}
                                    <p className='col-span-2 text-gray-600'>{item.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    );
}
