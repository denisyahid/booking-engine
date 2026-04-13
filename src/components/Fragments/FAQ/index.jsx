import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { contentAPI } from '../../../services/api';

export default function FAQ({slug}) {
    const [openIndex, setOpenIndex] = useState(null);
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        contentAPI.faq(slug)
            .then((res) => {
                setFaqs(res.data.faqs);
            })
            .catch(() => {
                setFaqs([]);
            });
    }, [slug]);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        faqs.length > 0 && (
            <div className='max-w-6xl mx-auto p-4 my-10 py-10'>
                <h2 className='text-2xl font-bold mb-6 text-gray-800'>Pertanyaan yang Sering Ditanyakan</h2>
                <div className='space-y-4'>
                    {faqs.map((faq, index) => (
                        <div key={index} className='border-b border-gray-200 pb-2'>
                            <button
                                onClick={() => toggleFAQ(index)}
                                className='flex justify-between items-center w-full text-left font-medium text-gray-700'>
                                {faq.question}
                                {openIndex === index ? (
                                    <ChevronUp className='w-5 h-5 text-gray-500' />
                                ) : (
                                    <ChevronDown className='w-5 h-5 text-gray-500' />
                                )}
                            </button>
                            {openIndex === index && <p className='mt-2 text-gray-600 text-sm'>{faq.answer}</p>}
                        </div>
                    ))}
                </div>
            </div>
        )
    );
}
