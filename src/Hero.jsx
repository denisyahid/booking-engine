import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Hero({ roomsByHotel = [] }) {
    const { slug } = useParams();
    const [rooms, setRooms] = useState([]);
    const [roomImages, setRoomImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // ambil data rooms
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/room`).then((res) => {
            setRooms(res.data);
        });
    }, [slug]);

    // ambil data images
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/images').then((res) => {
            setRoomImages(res.data);
        });
    }, []);

    const allRooms = roomsByHotel.length > 0 ? roomsByHotel : rooms;

    // carousel auto geser tiap 5 detik
    useEffect(() => {
        if (allRooms.length > 3) {
            const interval = setInterval(() => {
                handleNext();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [allRooms]);

    // fungsi ambil 3 room mulai dari currentIndex
    const getVisibleRooms = () => {
        // Jika data room kurang dari atau sama dengan 3, tampilkan semua
        if (allRooms.length <= 3) return allRooms;
        let visible = [];
        for (let i = 0; i < 3; i++) {
            visible.push(allRooms[(currentIndex + i) % allRooms.length]);
        }
        return visible;
    };

    // tombol next & prev
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % allRooms.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + allRooms.length) % allRooms.length);
    };

    return (
        (roomsByHotel.length > 0 || rooms.length > 0) && (
            <div className='md:py-5 bg-white'>
                <section className='max-w-6xl mx-auto py-4 overflow-hidden relative'>
                    <h2 className='font-sans p-5 md:p-0 text-2xl md:text-3xl md:mb-8'>Latest Room Deals</h2>

                    <div className='relative w-full'>
                        <div
                            className='flex transition-transform duration-700 ease-in-out'
                            style={{
                                transform: `translateX(-${0}%)`,
                            }}>
                            {getVisibleRooms().map((room) => {
                                const images = roomImages.filter((image) => image.room_id === room.id);
                                return (
                                    <article key={room.id} className='w-full md:w-1/3 flex-shrink-0 px-4'>
                                        <div className='bg-white shadow rounded-md overflow-hidden'>
                                            <div className='relative'>
                                                {images.length > 0 ? (
                                                    <img src={images[0].image} alt={room.name} className='w-full h-48 md:h-56 object-cover' />
                                                ) : (
                                                    <img
                                                        src='https://via.placeholder.com/400x300?text=No+Image'
                                                        alt='no image'
                                                        className='w-full h-48 md:h-56 object-cover'
                                                    />
                                                )}
                                            </div>

                                            <div className='pt-4 p-4'>
                                                <h3 className='font-sans text-lg mb-2'>{room.name}</h3>
                                                <p className='text-sm text-gray-600 mb-4'>
                                                    {room.description ? room.description.substring(0, 100) + '...' : 'No description available'}
                                                </p>
                                                <hr className='border-t border-gray-200' />
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* tombol prev */}
                        <button
                            onClick={handlePrev}
                            className='absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-r-md hover:bg-black/70'>
                            ‹
                        </button>

                        {/* tombol next */}
                        <button
                            onClick={handleNext}
                            className='absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-l-md hover:bg-black/70'>
                            ›
                        </button>
                    </div>
                </section>
            </div>
        )
    );
}
