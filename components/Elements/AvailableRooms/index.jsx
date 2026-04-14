import { useRouter } from 'next/navigation';
import { FaChevronRight, FaUser } from 'react-icons/fa';

export default function AvailableRooms({ rooms, checkIn, checkOut, hotelSlug }) {
    const router = useRouter();

    if (!rooms || rooms.length === 0) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatRupiah = (num) => {
        return 'Rp ' + Number(num).toLocaleString('id-ID');
    };

    const handleBookNow = (room) => {
        const selectedRate = room.selected_rate || room.rates?.[0] || {};
        const queryParams = new URLSearchParams({
            subroom_id: room.subroom_id,
            room_id: room.room_id,
            check_in: checkIn,
            check_out: checkOut,
            price_per_night: room.price_per_night,
            total_price: room.total_price,
            nights: room.nights,
            rate_id: selectedRate.id || '',
            rate_name: selectedRate.name || 'Standard',
        }).toString();
        router.push(`/booking/${room.room_id}?${queryParams}`);
    };

    return (
        <section className='w-full bg-gradient-to-b from-white via-blue-50 to-white py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header Section */}
                <div className='text-center mb-10'>
                    <div className='inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 text-sm font-semibold uppercase tracking-wide mb-4'>
                        <span>✓</span>
                        <span>Available Now</span>
                    </div>
                    <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
                        Available Rooms ({rooms.length})
                    </h2>
                    <p className='text-gray-600 text-lg'>
                        {formatDate(checkIn)} - {formatDate(checkOut)}
                    </p>
                </div>

                {/* Rooms Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {rooms.map((room) => {
                        const selectedRate = room.selected_rate || room.rates?.[0] || {};
                        const hasDiscount = !!room.discount;

                        return (
                            <div
                                key={room.subroom_id}
                                className='group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-400'
                            >
                                {/* Room Image */}
                                <div className='relative h-56 overflow-hidden bg-gray-200'>
                                    {room.images && room.images.length > 0 ? (
                                        <img
                                            loading='lazy'
                                            src={room.images[0].url || room.images[0]}
                                            alt={room.room_name}
                                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                        />
                                    ) : (
                                        <div className='w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center'>
                                            <span className='text-6xl'>🛏️</span>
                                        </div>
                                    )}

                                    {/* Price Badge */}
                                    <div className='absolute top-3 right-3 bg-white px-3 py-2 rounded-lg shadow-lg'>
                                        <p className='text-xs text-gray-500'>Price/Night</p>
                                        {hasDiscount && (
                                            <p className='text-xs text-gray-400 line-through'>
                                                {formatRupiah(room.base_price_per_night)}
                                            </p>
                                        )}
                                        <p className='text-lg font-bold text-blue-600'>
                                            {formatRupiah(room.price_per_night)}
                                        </p>
                                    </div>

                                    {/* Room Number Badge */}
                                    {room.subroom_name && (
                                        <div className='absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold'>
                                            Room {room.subroom_name}
                                        </div>
                                    )}
                                </div>

                                {/* Room Info */}
                                <div className='p-5'>
                                    {/* Room Name */}
                                    <h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors'>
                                        {room.room_name}
                                    </h3>

                                    {/* Room Details */}
                                    <div className='flex items-center gap-4 text-sm text-gray-600 mb-4'>
                                        <div className='flex items-center gap-1'>
                                            <FaUser className='w-4 h-4' />
                                            <span>{room.max_guests} Guests</span>
                                        </div>
                                        {selectedRate?.name && (
                                            <div className='text-blue-600 font-semibold'>
                                                {selectedRate.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected rate & discount */}
                                    {selectedRate?.name && (
                                        <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
                                            <p className='text-xs text-gray-500 mb-2'>Rate yang dipakai:</p>
                                            <div className='flex justify-between text-sm'>
                                                <span className='text-gray-700'>{selectedRate.name}</span>
                                                <span className='font-semibold text-gray-900'>
                                                    {formatRupiah(selectedRate.price || room.base_price_per_night || room.price_per_night)}
                                                </span>
                                            </div>
                                            {hasDiscount && (
                                                <div className='mt-2 flex justify-between text-sm text-green-700'>
                                                    <span>{room.discount.name} ({room.discount.percent}%)</span>
                                                    <span>-{formatRupiah(room.discount.amount)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Total Price */}
                                    <div className='pt-4 border-t border-gray-100 mb-4'>
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <p className='text-xs text-gray-500'>Total ({room.nights} nights)</p>
                                                <p className='text-2xl font-bold text-blue-600'>
                                                    {formatRupiah(room.total_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Book Button */}
                                    <button
                                        onClick={() => handleBookNow(room)}
                                        className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl'>
                                        <span>Book This Room</span>
                                        <FaChevronRight className='w-4 h-4' />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
