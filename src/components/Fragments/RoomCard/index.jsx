import { useEffect, useState } from 'react';
import { FaUser, FaBed, FaSmokingBan } from 'react-icons/fa';
import Facilities from '../../Elements/Facilities';
import RoomOpt from '../../Elements/RoomOpt';
import axios from 'axios';
import Carousel from '../../Elements/Carousel';
import ErrorElement from '../../Elements/ErrorElement';

export default function RoomCard({ handleBook, rooms, loading, roomRates, formatRupiah }) {
    const [carouselImages, setCarouselImages] = useState([]);
    
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/images').then((res) => {
            setCarouselImages(res.data);
        });
    }, []);
    if (loading) return <ErrorElement />;
    
    return (
        <div className='w-full bg-white md:py-10'>
            {rooms.map((room, id) => {
                if (id <= 2) {
                    return (
                        <div key={room.id} className='max-w-6xl mx-auto md:my-10 bg-white shadow-md overflow-hidden md:flex'>
                            {/* Left - Image & Facilities */}
                            <div className='md:w-1/2 p-4'>
                                {carouselImages.filter((image) => image.room_id == room.id).length > 0 ? (
                                    <Carousel images={carouselImages.filter((image) => image.room_id == room.id)} name={room.name} roomId={room.id} />
                                ) : (
                                    <img
                                        src='https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                                        alt={room.name}
                                        className=' w-full h-64 md:h-80 object-cover'
                                    />
                                )}

                                <h2 className='text-xl font-bold mt-4'>{room.name}</h2>
                                <p className='text-gray-500 flex items-center gap-2 mt-1'>{room.description.substring(0, 70)} ...</p>

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
                                            <div className={`border p-4 shadow-sm hover:shadow-md transition`}>
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
                                                            <p className='mt-3 font-bold text-lg text-primary'>{formatRupiah(rate.rate)}</p>
                                                            <p className='text-xs text-gray-500'>Total for 1 room includes taxes & fee</p>
                                                        </div>
                                                        <button
                                                            id={rate.id}
                                                            onClick={handleBook}
                                                            // type='submit'
                                                            // disabled={!checkIn || !checkOut || adult <= 0}
                                                            className={`bg-primary h-10 text-white px-6 py-0  shadow `}>
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
