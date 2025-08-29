import { div } from 'framer-motion/client';
import { useState } from 'react';
import { FaUser, FaBed, FaSmokingBan, FaUtensils, FaVectorSquare } from 'react-icons/fa';
import Facilities from '../../Elements/Facilities';
import RoomOpt from '../../Elements/RoomOpt';

export default function RoomCard() {
    const [selected, setSelected] = useState(null);

    const rooms = [
        {
            name: 'Executive Twin or Hollywood',
            size: '32 m²',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
            facilities: [
                'Android TV',
                'Free Netflix Access',
                'Air Conditioning',
                'Complimentary Wifi',
                'Bottled Water',
                'Shower',
                'Hair Dryer',
                'Smart TV',
                'Coffee & Tea Maker',
                'Refrigerator',
                'Safe Deposit Box',
            ],
            options: [
                {
                    title: 'Room Only',
                    guest: 1,
                    bed: '2 Single Bed',
                    breakfast: false,
                    refundable: false,
                    price: 618000,
                },
                {
                    title: 'Breakfast',
                    guest: 1,
                    bed: '2 Single Bed',
                    breakfast: true,
                    refundable: false,
                    price: 728000,
                },
            ],
        },
        {
            name: 'Executive Twin or Hollywood',
            size: '32 m²',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
            facilities: [
                'Android TV',
                'Free Netflix Access',
                'Air Conditioning',
                'Complimentary Wifi',
                'Bottled Water',
                'Shower',
                'Hair Dryer',
                'Smart TV',
                'Coffee & Tea Maker',
                'Refrigerator',
                'Safe Deposit Box',
            ],
            options: [
                {
                    title: 'Room Only',
                    guest: 1,
                    bed: '2 Single Bed',
                    breakfast: false,
                    refundable: false,
                    price: 618000,
                },
                {
                    title: 'Breakfast',
                    guest: 1,
                    bed: '2 Single Bed',
                    breakfast: true,
                    refundable: false,
                    price: 728000,
                },
            ],
        },
    ];
    //     name: 'Executive Twin or Hollywood',
    //     size: '32 m²',
    //     image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    //     facilities: [
    //         'Android TV',
    //         'Free Netflix Access',
    //         'Air Conditioning',
    //         'Complimentary Wifi',
    //         'Bottled Water',
    //         'Shower',
    //         'Hair Dryer',
    //         'Smart TV',
    //         'Coffee & Tea Maker',
    //         'Refrigerator',
    //         'Safe Deposit Box',
    //     ],
    //     options: [
    //         {
    //             title: 'Room Only',
    //             guest: 1,
    //             bed: '2 Single Bed',
    //             breakfast: false,
    //             refundable: false,
    //             price: 618000,
    //         },
    //         {
    //             title: 'Breakfast',
    //             guest: 1,
    //             bed: '2 Single Bed',
    //             breakfast: true,
    //             refundable: false,
    //             price: 728000,
    //         },
    //     ],
    // };

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return (
        <div className='w-full bg-white md:py-10'>
            {rooms.map((room) => (
                <div className='max-w-6xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden md:flex'>
                    {/* Left - Image & Facilities */}
                    <div className='md:w-1/2 p-4'>
                        <img src={room.image} alt={room.name} className='rounded-xl w-full h-64 md:h-80 object-cover' />
                        <h2 className='text-xl font-bold mt-4'>{room.name}</h2>
                        <p className='text-gray-500 flex items-center gap-2 mt-1'>
                            <FaVectorSquare className='text-blue-500' /> {room.size}
                        </p>

                        <div className='flex flex-wrap gap-2 mt-3'>
                            {room.facilities.map((f, idx) => (
                                <Facilities f={f} idx={idx} />
                            ))}
                        </div>
                    </div>

                    {/* Right - Booking Options */}
                    <div className='md:w-1/2 p-4 flex flex-col gap-4'>
                        {room.options.map((opt, idx) => (
                            <div
                                key={idx}
                                className={`border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer ${
                                    selected === idx ? 'border-blue-500' : 'border-gray-200'
                                }`}
                                onClick={() => setSelected(idx)}>
                                <div className='flex justify-between items-center'>
                                    <h3 className='font-semibold text-lg'>{opt.title}</h3>
                                    {/* <button className='bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700'>Book</button> */}
                                </div>
                                <p className='text-sm text-gray-500 mt-1'>{opt.refundable ? 'Refundable' : 'Refund and reschedule not allowed.'}</p>

                                <div className='flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600'>
                                    <RoomOpt icon={<FaUser />} text={`${opt.guest}`} />
                                    <RoomOpt icon={<FaBed />} text={opt.bed} />
                                    <RoomOpt icon={<FaSmokingBan />} text={'Non Smoking'} />
                                    {/* <span className='flex items-center gap-1'>
                                    <FaUser /> {opt.guest} Guests
                                </span>
                                <span className='flex items-center gap-1'>
                                    <FaBed /> {opt.bed}
                                </span>
                                <span className='flex items-center gap-1'>
                                    <FaSmokingBan /> Non-Smoking
                                </span> */}
                                    {opt.breakfast && (
                                        <span className='flex items-center gap-1'>
                                            <FaUtensils /> Breakfast Included
                                        </span>
                                    )}
                                </div>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className='mt-3 font-bold text-lg text-blue-600'>{formatRupiah(opt.price)}</p>
                                        <p className='text-xs text-gray-500'>Total for 1 room includes taxes & fee</p>
                                    </div>
                                <button className='bg-blue-600 h-10  text-white px-6 py-0 rounded-full shadow hover:bg-blue-700'>Book</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
