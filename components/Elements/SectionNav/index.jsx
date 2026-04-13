import { Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const SectionNav = ({ onShare }) => {
    const sections = [
        { id: 'overview', label: 'Overview' },
        { id: 'tickets', label: 'Ticket Options' },
        { id: 'about', label: 'General Information' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'faqs', label: 'FAQs' },
    ];

    const [active, setActive] = useState('overview');

   useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 0.5, // cukup 30% kelihatan, langsung dianggap aktif
        }
    );

    sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
    });

    return () => observer.disconnect();
}, []);



    const handleClick = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className='sticky top-16 left-0 w-full z-40 bg-white border-b border-gray-200 shadow-sm'>
            <div className='max-w-6xl mx-auto flex items-center justify-between px-4 overflow-x-auto'>
                <div className='flex space-x-4 md:space-x-6'>
                    {sections.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => handleClick(s.id)}
                            className={`py-3 px-2 text-sm md:text-base font-medium whitespace-nowrap transition-colors ${
                                active === s.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
                            }`}>
                            {s.label}
                        </button>
                    ))}
                </div>
                <button onClick={onShare} className='ml-4 p-2 rounded-full hover:bg-gray-100 text-gray-600'>
                    <Share2 className='w-5 h-5' />
                </button>
            </div>
        </div>
    );
};

export default SectionNav;
