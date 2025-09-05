import { useState } from "react";
import { motion } from 'framer-motion';
import { ChevronDown } from "lucide-react";


export default function AccordionItem ({ title })  {
    const [open, setOpen] = useState(false);

    return (
        <div className='border-b py-3 cursor-pointer' onClick={() => setOpen(!open)}>
            <div className='flex items-center gap-3'>
                <div className='bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full'>
                    <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                </div>
                <span className='font-medium text-gray-700'>{title}</span>
            </div>
            {open && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='pl-9 pr-2 text-gray-600 mt-2 text-sm'>
                    {title} details here...
                </motion.div>
            )}
        </div>
    );
};
