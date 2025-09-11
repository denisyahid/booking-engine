import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Hero({ roomsByHotel = [] }) {
    const { slug } = useParams();
    const [rooms, setRooms] = useState([]);
    const [roomImages, setRoomImages] = useState([]);

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

    return (
        (roomsByHotel.length > 0 || rooms.length > 0) && (
            <div className='md:py-5 bg-white'>
                {/* ROOM CARDS */}
                <section className='max-w-6xl mx-auto py-4'>
                    <h2 className='font-sans p-5 md:p-0 text-2xl md:text-3xl md:mb-8'>Latest Room Deals</h2>

                    <div className='grid p-5 md:p-0 grid-cols-1 md:grid-cols-3 gap-8'>
                        {(roomsByHotel.length > 0 ? roomsByHotel : rooms)
                            .slice(0, 3) // batasi 3 room
                            .map((room) => {
                                const images = roomImages.filter((image) => image.room_id === room.id);

                                return (
                                    <article key={room.id} className='bg-white shadow rounded-md'>
                                        <div className='relative overflow-hidden'>
                                            {images.length > 0 ? (
                                                <img src={images[0].image} alt={room.name} className='w-full h-48 md:h-48 object-cover' />
                                            ) : (
                                                <img
                                                    src='https://via.placeholder.com/400x300?text=No+Image'
                                                    alt='no image'
                                                    className='w-full h-48 md:h-48 object-cover'
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
                                    </article>
                                );
                            })}
                    </div>
                </section>
            </div>
        )
    );
}
