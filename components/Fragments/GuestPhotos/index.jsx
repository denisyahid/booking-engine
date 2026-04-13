import { useState } from 'react';

const GuestPhotos = ({ guestPhotos = [] }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    return (
        guestPhotos.length > 0 && (
            <div id='reviews' className='w-full max-w-6xl mx-auto py-6 my-10'>
                {/* Judul */}
                <h2 className='text-xl font-semibold mb-2'>More Reviews from Other Guests</h2>
                <p className='text-sm text-gray-600 mb-4'>Most Recent Photos by Guests</p>

                {/* Grid Foto */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3'>
                    {guestPhotos.slice(0, 4).map((photo, index) => (
                        <div
                            key={index}
                            className='relative w-full h-32 sm:h-40 md:h-48 bg-gray-200 overflow-hidden cursor-pointer'
                            onClick={() => setSelectedPhoto(photo.image)} // simpan foto yang diklik
                        >
                            <img src={photo.image} alt={`Guest photo ${index + 1}`} className='w-full h-full object-cover' />
                        </div>
                    ))}

                    {/* See All Photos */}
                    {guestPhotos[4] && (
                        <div
                            className='relative w-full h-32 sm:h-40 md:h-48 bg-black text-white flex items-center justify-center cursor-pointer'
                            onClick={() => setSelectedPhoto(guestPhotos[4].image)} // juga bisa popup
                        >
                            <img
                                className={`w-full h-full object-cover ${guestPhotos.length > 5 && 'opacity-70'} `}
                                src={guestPhotos[4].image}
                                alt=''
                            />
                            {guestPhotos.length > 5 && <span className='text-base font-medium absolute'>See All Photos</span>}
                        </div>
                    )}
                </div>

                {/* Popup / Modal */}
                {selectedPhoto && (
                    <div
                        className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50'
                        onClick={() => setSelectedPhoto(null)} // klik background tutup popup
                    >
                        <div className='relative max-w-3xl max-h-[90vh]'>
                            <img src={selectedPhoto} alt='Selected' className='w-full md:h-[600px] object-cover' />
                            <button
                                className='absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-black font-bold'
                                onClick={() => setSelectedPhoto(null)}>
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default GuestPhotos;
