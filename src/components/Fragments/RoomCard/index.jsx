import { useEffect, useState } from 'react';
import { FaUser, FaBed, FaSmokingBan, FaUtensils, FaVectorSquare } from 'react-icons/fa';
import Facilities from '../../Elements/Facilities';
import RoomOpt from '../../Elements/RoomOpt';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RoomCard() {
    const [selected, setSelected] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [roomFacilities, setRoomFacilities] = useState([]);
    const [roomRates, setRoomRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    // const handleBook = (e) => {
    //     navigate(`http://localhost:5173/booking/${e.target}`,{
    //         state: {
    //             roomId: 
    //         }
    //     })
    // }

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/${id}/rooms`)
            .then((data) => {
                setRooms(data.data);
                console.log(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/facilities/${id}`)
            .then((data) => {
                let facilities = JSON.parse(data.data.facility_name);
                setRoomFacilities(facilities);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/rate`).then((res) => setRoomRates(res.data));
    }, []);

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (loading) return <p>Loading...</p>;

    return (
        <div className='w-full bg-white md:py-10'>
            {rooms.map((room, id) => {
                if (id <= 2) {
                    return (
                        <div key={room.id} className='max-w-6xl mx-auto md:my-10 bg-white shadow-md rounded-2xl overflow-hidden md:flex'>
                            {/* Left - Image & Facilities */}
                            <div className='md:w-1/2 p-4'>
                                <img
                                    src={
                                        room.image
                                            ? `http://127.0.0.1:8000/storage/${room.image}`
                                            : 'https://via.placeholder.com/600x400?text=No+Image'
                                    }
                                    alt={room.name}
                                    className='rounded-xl w-full h-64 md:h-80 object-cover'
                                />
                                <h2 className='text-xl font-bold mt-4'>{room.name}</h2>
                                <p className='text-gray-500 flex items-center gap-2 mt-1'>
                                    <FaVectorSquare className='text-blue-500' /> {room.size} M<sup>2</sup>
                                </p>

                                <div className='flex flex-wrap gap-2 mt-3'>
                                    {roomFacilities.map((f, idx) => (
                                        <Facilities key={idx} f={f} idx={idx} />
                                    ))}
                                </div>
                            </div>
                            <div className='flex md:w-1/2 flex-col'>
                                {roomRates
                                    .filter((rate) => rate.room_id == room.id)
                                    .map((rate) => (
                                        <div className='md:w-full p-4 flex flex-col gap-4'>
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
                                                        <a href={`/booking/${rate.id}`} className='bg-blue-600 h-10 flex items-center text-white px-6 py-0 rounded-full shadow hover:bg-blue-700'>
                                                            Book
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            ,{/* Right - Booking Options (adaptasi dari API) */}
                        </div>
                    );
                }
            })}
        </div>
    );
}
