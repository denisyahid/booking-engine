const Facilities = ({f,idx}) => {
    return (
        <span key={idx} className='bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600'>
            {f}
        </span>
    );
};

export default Facilities;