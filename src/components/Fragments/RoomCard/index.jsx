import { useEffect, useState } from 'react';
import { FaUser, FaBed, FaSmokingBan, FaVectorSquare } from 'react-icons/fa';
import Facilities from '../../Elements/Facilities';
import RoomOpt from '../../Elements/RoomOpt';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Carousel from '../../Elements/Carousel';
import { image } from 'framer-motion/client';

export default function RoomCard({ checkIn, checkOut, adult, children, handleBook, rooms, loading, roomRates, roomFacilities, formatRupiah }) {
    const [carouselImages, setCarouselImages] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/images').then((res) => {
            setCarouselImages(res.data);
            console.log(res.data);
        });
        // .catch(err) {
        //     console.log(err.message);
        // }
    }, []);
    if (loading) return <p>Loading...</p>;

    return (
        <div className='w-full bg-white md:py-10'>
            {rooms.map((room, id) => {
                if (id <= 2) {
                    return (
                        <div key={room.id} className='max-w-6xl mx-auto md:my-10 bg-white shadow-md rounded-2xl overflow-hidden md:flex'>
                            {/* Left - Image & Facilities */}
                            <div className='md:w-1/2 p-4'>
                                {carouselImages.filter((image) => image.room_id == room.id).length > 0 ? (
                                    <Carousel images={carouselImages.filter((image) => image.room_id == room.id)} name={room.name} roomId={room.id} />
                                ) : (
                                    <img
                                        src='https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                        alt={room.name}
                                        className='rounded-xl w-full h-64 md:h-80 object-cover'
                                    />
                                )}

                                <h2 className='text-xl font-bold mt-4'>{room.name}</h2>
                                <p className='text-gray-500 flex items-center gap-2 mt-1'>
                                    <FaVectorSquare className='text-blue-500' /> {room.size} M<sup>2</sup>
                                </p>

                                <div className='flex flex-wrap gap-2 mt-3'>
                                    {room.facilities &&
                                        JSON.parse(room.facilities.facility_name).map((f, idx) => <Facilities key={idx} f={f} idx={idx} />)}
                                </div>
                            </div>
                            <div className='md:w-1/2 p-4'>
                                {roomRates
                                    .filter((rate) => rate.room_id == room.id)
                                    .map((rate) => (
                                        <div key={rate.id} className='md:w-full p-4 flex flex-col gap-4'>
                                            <div className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition`}>
                                                <div className='flex justify-between items-center'>
                                                    <h3 className='font-semibold text-lg'>{rate.plan}</h3>
                                                </div>
                                                <p className='text-sm text-gray-500 mt-1'>
                                                    {!rate.is_refundable ? 'Refund and reschedule not allowed.' : 'No rate set'}
                                                </p>

                                                <div className='flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600'>
                                                    <RoomOpt icon={<FaUser />} text={`${room.capacity}`} />
                                                    <RoomOpt icon={<FaBed />} text={`${room.number_of_bed} Bed`} />
                                                    {!rate.smoking_policy && <RoomOpt icon={<FaSmokingBan />} text='Non Smoking' />}
                                                    {/* Kalau nanti ada breakfast field di API bisa tambah disini */}
                                                    {/* room.breakfast && (
                          <RoomOpt icon={<FaUtensils />} text="Breakfast Included" />
                        ) */}
                                                </div>
                                                {rate.rate && (
                                                    <div className='flex justify-between items-center'>
                                                        <div>
                                                            <p className='mt-3 font-bold text-lg text-blue-600'>{formatRupiah(rate.rate)}</p>
                                                            <p className='text-xs text-gray-500'>Total for 1 room includes taxes & fee</p>
                                                        </div>
                                                        <button
                                                            id={rate.id}
                                                            onClick={handleBook}
                                                            // type='submit'
                                                            // disabled={!checkIn || !checkOut || adult <= 0}
                                                            className={`bg-[#0079FF] h-10 text-white px-6 py-0 rounded-full shadow `}>
                                                            Book
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
}
