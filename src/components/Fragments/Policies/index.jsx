import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ErrorElement from '../../Elements/ErrorElement';

export default function Policies() {
    const [policies, setPolicies] = useState([]);
    const {slug} = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/policies`)
        .then((res) => {
            setPolicies(res.data.policies);
        });
    }, [slug]);

    if(!policies) return <ErrorElement />

    return (
        policies.length > 0 && (
        <div className='max-w-3xl mx-auto p-4 md:my-20'>
            <h2 className='text-xl font-bold mb-6'>Kebijakan Akomodasi</h2>

            {policies.map((policyGroup, idx) => (
                <div key={idx} className='mb-8'>
                    <h3 className='text-lg font-semibold mb-4'>{policyGroup.type}</h3>
                    <div className='space-y-2'>
                        {policyGroup.items.map((item, i) => (
                            <div key={i} className='flex gap-3'>
                                {item.title && <span className='w-28 font-medium'>{item.title}</span>}
                                <p className='text-gray-700'>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>)
    );
}
