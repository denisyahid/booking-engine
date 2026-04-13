import { useEffect, useState } from 'react';
import { FaUser, FaBed, FaSmokingBan, FaWifi, FaRulerCombined, FaVectorSquare, FaCheckCircle } from 'react-icons/fa';
import { MdOutlineRoomService, MdOutlineKingBed } from 'react-icons/md';
import Facilities from '../../Elements/Facilities';
import RoomOpt from '../../Elements/RoomOpt';
import { rateAPI, contentAPI, facilityAPI } from '../../../src/services/api';
import Carousel from '../../Elements/Carousel';
import ErrorElement from '../../Elements/ErrorElement';

export default function RoomCard({ handleBook, rooms, loading, formatRupiah, checkIn, checkOut,roomImages }) {
    const [roomRates, setRoomRates] = useState([]);
    const [specialPrice, setSpecialPrice] = useState([]);

    useEffect(() => {
        rateAPI.roomRateDates().then((res) => {
            setRoomRates(res.data); // sudah ada min_price dari backend
        });
    }, []);

    // Fetch rates sesuai tanggal
    const fetchRates = async () => {
        try {
            const res = await rateAPI.specialRates();
            setSpecialPrice(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRates();
    }, [checkIn, checkOut]); // update otomatis kalau tanggal berubah

    if (loading) return <ErrorElement />;

    return (
        <div className='w-full bg-gradient-to-b from-gray-50 to-white md:py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <div className='mb-8'>
                    <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                        Our Rooms
                    </h2>
                    <p className='text-gray-600 text-lg'>
                        Pilih kamar yang sesuai dengan kebutuhan Anda
                    </p>
                </div>

                {rooms.map((room, id) => {
                    if (id <= 2) {
                        // Calculate discount
                        const roomRate = roomRates.find((rate) => rate.room_id == room.id);
                        const normalPrice = roomRate?.rate || 0;
                        const specialsForRate = specialPrice.filter((special) => special.room_rate_id === roomRate?.id);
                        const matchedSpecial = specialsForRate.find((s) => s.date === checkIn);
                        const currentPrice = matchedSpecial?.special_price || normalPrice;
                        const discount = normalPrice > 0 && currentPrice < normalPrice 
                            ? Math.round(((normalPrice - currentPrice) / normalPrice) * 100) 
                            : 0;

                        return (
                            <div key={room.id} className='mb-10 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
                                <div className='md:flex'>
                                    {/* Left - Image & Info */}
                                    <div className='md:w-1/2'>
                                        {/* Image Carousel */}
                                        <div className='relative h-72 md:h-full'>
                                            {roomImages.filter((image) => image.room_id == room.id).length > 0 ? (
                                                <Carousel images={roomImages.filter((image) => image.room_id == room.id)} name={room.name} roomId={room.id} />
                                            ) : (
                                                <img loading='lazy'
                                                    src='https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=870&auto=format&fit=crop'
                                                    alt={room.name}
                                                    className='w-full h-full object-cover'
                                                />
                                            )}
                                            
                                            {/* Discount Badge */}
                                            {discount > 0 && (
                                                <div className='absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg'>
                                                    {discount}% OFF
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right - Details & Pricing */}
                                    <div className='md:w-1/2 p-6 md:p-8'>
                                        {/* Room Title & Description */}
                                        <div className='mb-6'>
                                            <h3 className='text-2xl font-bold text-gray-900 mb-2'>{room.name}</h3>
                                            <p className='text-gray-600 text-sm leading-relaxed'>
                                                {room.description || 'Kamar nyaman dengan fasilitas lengkap untuk kenyamanan Anda'}
                                            </p>
                                        </div>

                                        {/* Room Features */}
                                        <div className='grid grid-cols-2 gap-4 mb-6'>
                                            <div className='flex items-center gap-3 bg-blue-50 p-3 rounded-lg'>
                                                <FaUser className='text-blue-600 text-lg' />
                                                <div>
                                                    <p className='text-xs text-gray-600'>Capacity</p>
                                                    <p className='font-semibold text-sm text-gray-900'>{room.capacity || 2} Persons</p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-3 bg-green-50 p-3 rounded-lg'>
                                                <FaBed className='text-green-600 text-lg' />
                                                <div>
                                                    <p className='text-xs text-gray-600'>Beds</p>
                                                    <p className='font-semibold text-sm text-gray-900'>{room.number_of_bed || 1} Bed</p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-3 bg-purple-50 p-3 rounded-lg'>
                                                <FaVectorSquare className='text-purple-600 text-lg' />
                                                <div>
                                                    <p className='text-xs text-gray-600'>Size</p>
                                                    <p className='font-semibold text-sm text-gray-900'>{room.size || 24} m²</p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-3 bg-orange-50 p-3 rounded-lg'>
                                                <FaWifi className='text-orange-600 text-lg' />
                                                <div>
                                                    <p className='text-xs text-gray-600'>Internet</p>
                                                    <p className='font-semibold text-sm text-gray-900'>Free WiFi</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Facilities */}
                                        <div className='mb-6'>
                                            <h4 className='text-sm font-semibold text-gray-900 mb-3'>Room Facilities</h4>
                                            <div className='flex flex-wrap gap-2'>
                                                {room.facilities &&
                                                room.facilities.facility_name &&
                                                (() => {
                                                    try {
                                                        return JSON.parse(room.facilities.facility_name).slice(0, 4).map((f, idx) => <Facilities key={idx} f={f} idx={idx} />);
                                                    } catch (e) {
                                                        return null;
                                                    }
                                                })()}
                                                <Facilities f="Air Conditioning" idx={4} />
                                                <Facilities f="Flat TV" idx={5} />
                                            </div>
                                        </div>

                                        {/* Pricing Section */}
                                        {roomRates
                                            .filter((rate) => rate.room_id == room.id)
                                            .map((rate) => (
                                                <div key={rate.id} className='border-t pt-6'>
                                                    {/* Plan Name */}
                                                    <div className='flex items-center justify-between mb-4'>
                                                        <h4 className='font-bold text-lg text-gray-900 flex items-center gap-2'>
                                                            <MdOutlineKingBed className='text-primary' />
                                                            {rate.plan || 'Room Only'}
                                                        </h4>
                                                        {rate.is_refundable && (
                                                            <span className='bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold'>
                                                                Refundable
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Price Display */}
                                                    <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-4'>
                                                        {(() => {
                                                            const specialsForRate = specialPrice.filter((special) => special.room_rate_id === rate.id);
                                                            const matchedSpecial = specialsForRate.find((s) => s.date === checkIn);
                                                            const lowestPrice = specialsForRate.length > 0 ? Math.min(...specialsForRate.map((s) => s.special_price)) : rate.rate;

                                                            if (matchedSpecial) {
                                                                return (
                                                                    <div className='flex justify-between items-end'>
                                                                        <div>
                                                                            <p className='text-xs text-gray-600 mb-1'>Normal Price</p>
                                                                            <p className='text-lg text-gray-500 line-through mb-2'>
                                                                                {formatRupiah(rate.rate)}
                                                                            </p>
                                                                            <p className='text-xs text-gray-600 mb-1'>Special Price</p>
                                                                            <p className='text-3xl font-bold text-primary'>
                                                                                {formatRupiah(matchedSpecial.special_price)}
                                                                            </p>
                                                                            <p className='text-xs text-gray-600 mt-2'>
                                                                                /night includes taxes & fees
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            id={rate.id}
                                                                            onClick={handleBook}
                                                                            className='bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105'>
                                                                            Book Now
                                                                        </button>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <div className='flex justify-between items-end'>
                                                                    <div>
                                                                        <p className='text-xs text-gray-600 mb-1'>Starting from</p>
                                                                        <p className='text-3xl font-bold text-primary'>
                                                                            {formatRupiah(rate.rate)}
                                                                        </p>
                                                                        <p className='text-xs text-gray-600 mt-2'>
                                                                            /night includes taxes & fees
                                                                        </p>
                                                                        {lowestPrice < rate.rate && (
                                                                            <div className='mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg'>
                                                                                <p className='text-xs text-yellow-800'>
                                                                                    💡 Available cheaper at {formatRupiah(lowestPrice)} on{' '}
                                                                                    {new Date(
                                                                                        specialsForRate.find((s) => s.special_price === lowestPrice).date
                                                                                    ).toLocaleDateString('id-ID', {
                                                                                        day: 'numeric',
                                                                                        month: 'long',
                                                                                    })}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <button
                                                                        id={rate.id}
                                                                        onClick={handleBook}
                                                                        className='bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105'>
                                                                        Book Now
                                                                    </button>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>

                                                    {/* Policies */}
                                                    <div className='space-y-2'>
                                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                            <FaCheckCircle className='text-green-500' />
                                                            <span>Free cancellation available</span>
                                                        </div>
                                                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                            <FaCheckCircle className='text-green-500' />
                                                            <span>Instant confirmation</span>
                                                        </div>
                                                        {!rate.smoking_policy && (
                                                            <div className='flex items-center gap-2 text-sm text-gray-600'>
                                                                <FaCheckCircle className='text-green-500' />
                                                                <span>Non-smoking room</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}
