import { useState } from 'react';

export default function Gallery({ images = [] ,width = "w-1/2",height = "h-[270px]"}) {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className={`w-full md:${width}`} >
            {/* Grid Gallery */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${height} sm:${height} overflow-hidden`}>
                {images.slice(0, 5).map((img, i) => (
                    <div
                        key={i}
                        className={`relative cursor-pointer overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                        onClick={() => setSelectedImage(img)}>
                        <img loading='lazy' src={img} alt={`Hotel ${i}`} className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' />
                    </div>
                ))}

                {/* More button jika gambar lebih dari 5 */}
                {images.length > 5 && (
                    <div
                        className='flex items-center justify-center bg-gray-800 text-white text-lg font-semibold cursor-pointer'
                        onClick={() => setSelectedImage(images[5])}>
                        +{images.length - 5} More
                    </div>
                )}
            </div>

            {/* Modal / Pop Up */}
            {selectedImage && (
                <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
                    <div className='relative max-w-4xl w-full'>
                        <button onClick={() => setSelectedImage(null)} className='absolute -top-10 right-0 text-white text-2xl font-bold'>
                            ✕
                        </button>
                        <img loading='lazy' src={selectedImage} alt='Selected' className='w-full max-h-[80vh] object-contain shadow-lg' />
                    </div>
                </div>
            )}
        </div>
    );
}
