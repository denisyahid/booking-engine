
const GuestPhotos = ({ guestPhotos = [] }) => {
    return (
        <div className='w-full max-w-6xl mx-auto py-6'>
            {/* Judul */}
            <h2 className='text-xl font-semibold mb-2'>More Reviews from Other Guests</h2>
            <p className='text-sm text-gray-600 mb-4'>Most Recent Photos by Guests</p>

            {/* Grid Foto */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3'>
                {guestPhotos.slice(0, 4).map((photo, index) => (
                    <div key={index} className='relative w-full h-32 sm:h-40 md:h-48 bg-gray-200 overflow-hidden'>
                        <img src={photo.image} alt={`Guest photo ${index + 1}`} className='w-full h-full object-cover' />
                    </div>
                ))}

                {/* See All Photos */}
                <div className='relative w-full h-32 sm:h-40 md:h-48 bg-black text-white flex items-center justify-center cursor-pointer'>
                    <span className='text-base font-medium'>See All Photos</span>
                </div>
            </div>
        </div>
    );
};

export default GuestPhotos;
