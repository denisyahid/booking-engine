import { div } from 'framer-motion/client';

const RoomOpt = ({ icon, text }) => {
    return (
        <span className='flex items-center gap-1'>
            {icon} {text}
        </span>
    );
};

export default RoomOpt;
