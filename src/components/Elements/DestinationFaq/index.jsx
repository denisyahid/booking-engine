import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DestinationFaq({ faq }) {
    const faqs = faq?.destination_faq ?? []; // ambil langsung dari JSON
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div id='faqs' className='w-full max-w-6xl mx-auto py-10 my-10'>
            <h2 className='text-xl font-semibold mb-4'>Frequently Asked Questions</h2>

            {faqs.length > 0 ? (
                <div className='space-y-4'>
                    {faqs.map((faq,index) => (
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
                            {openIndex === index && <p className='mt-2 text-gray-600 text-sm'>{faq.pivot?.answer}</p>}
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-gray-500'>Belum ada FAQ untuk destinasi ini.</p>
            )}
        </div>
    );
}
