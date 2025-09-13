import { useEffect, useState } from 'react';
import { FaUser, FaBed, FaSmokingBan } from 'react-icons/fa';
import Facilities from '../../Elements/Facilities';
import RoomOpt from '../../Elements/RoomOpt';
import axios from 'axios';
import Carousel from '../../Elements/Carousel';
import ErrorElement from '../../Elements/ErrorElement';

export default function RoomCard({ handleBook, rooms, loading, formatRupiah }) {
    const [carouselImages, setCarouselImages] = useState([]);
    const [roomRates, setRoomRates] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/images').then((res) => {
            setCarouselImages(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/room/rate/date').then((res) => {
            setRoomRates(res.data); // sudah ada min_price dari backend
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
                                        src='https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop'
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

                            {/* Right - Rates */}
                            <div className='md:w-1/2 p-4'>
                                {roomRates
                                    .filter((rate) => rate.room_id == room.id)
                                    .map((rate) => (
                                        <div key={rate.id} className='md:w-full p-4 flex flex-col gap-4'>
                                            <div className='border p-4 shadow-sm hover:shadow-md transition'>
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
                                                </div>

                                                {rate.rate && (
                                                    <div className='flex justify-between items-center'>
                                                        <div>
                                                            {rate.room_rate_dates && rate.room_rate_dates.length > 0 ? (
                                                                <p className='mt-3 font-bold text-lg text-primary'>{formatRupiah(rate.rate)}</p>
                                                            ) : (
                                                                <p className='mt-3 font-bold text-lg text-primary'>{formatRupiah(rate.rate)}</p>
                                                            )}

                                                            {/* Kalau ada harga promo (min_price < rate.rate), tampilkan detail dari room_rate_dates */}
                                                            {rate.min_price < rate.rate &&
                                                                rate.room_rate_dates &&
                                                                rate.room_rate_dates.length > 0 && (
                                                                    <div className='mt-1 text-sm text-red-600'>
                                                                        {rate.room_rate_dates.map((rDate) => (
                                                                            <p className='text-xs my-2' key={rDate.id}>
                                                                                Tersedia harga {formatRupiah(rDate.special_price)} jika checkout pada
                                                                                tanggal{' '}
                                                                                {new Date(rDate.date).toLocaleDateString('id-ID', {
                                                                                    day: 'numeric',
                                                                                    month: 'long',
                                                                                })}
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                            <p className='text-xs text-gray-500'>Total for 1 room includes taxes & fee</p>
                                                        </div>
                                                        <button
                                                            id={rate.id}
                                                            onClick={handleBook}
                                                            className='bg-primary h-10 text-white px-6 py-0 shadow'>
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
