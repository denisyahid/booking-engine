import { useRef, useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import axios from 'axios';

const BookingForm = ({ slug, adult, children,roomQuantity, setAdult, setChildren,setRoomQuantity, handleDateChange ,range, onCheckComplete}) => {
    const [open, setOpen] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);

    const refOne = useRef(null);
    const checkTimeoutRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (refOne.current && !refOne.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    // Check availability ke backend (hanya saat tombol diklik)
    const checkAvailability = async () => {
        if (!range || !range[0] || !range[0].startDate || !range[0].endDate) return;

        const checkIn = range[0].startDate.toISOString().split('T')[0];
        const checkOut = range[0].endDate.toISOString().split('T')[0];

        // Validasi tanggal
        if (new Date(checkIn) >= new Date(checkOut)) {
            setAvailabilityStatus(null);
            setAvailableRooms([]);
            return;
        }

        setIsChecking(true);
        setAvailabilityStatus(null);

        try {
            // Gunakan PUBLIC API (tidak perlu autentikasi)
            const response = await axios.post('http://127.0.0.1:8000/api/public/availability/check', {
                hotel_id: 1, // Demo hotel ID
                check_in: checkIn,
                check_out: checkOut,
                adults: adult,
                children: children,
            });

            if (response.data.success && response.data.data.total_available > 0) {
                const data = response.data.data;
                setAvailabilityStatus({
                    available: true,
                    count: data.total_available,
                    message: `${data.total_available} room(s) available for ${data.nights} night(s)`,
                });
                const availableRoomsList = data.available_rooms || [];
                setAvailableRooms(availableRoomsList);

                // Pass available rooms to parent component
                if (onCheckComplete) {
                    onCheckComplete(availableRoomsList);
                }
            } else {
                setAvailabilityStatus({
                    available: false,
                    count: 0,
                    message: 'No rooms available for selected dates',
                });
                setAvailableRooms([]);
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            setAvailabilityStatus({
                available: false,
                count: 0,
                message: 'Unable to check availability. Please try again.',
            });
            setAvailableRooms([]);
        } finally {
            setIsChecking(false);
        }
    };

    // Format DD/MM/YYYY
    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        // const form = e.target;

    };

    return (
        <div className='sticky top-0 z-50 bg-black/70 p-4 max-w-6xl mx-auto shadow-lg border border-black/40 my-10'>
            <form onSubmit={handleSubmit} action={`/${slug}`} method='GET' className='grid gap-3'>
                <div className='flex items-end gap-4 w-full'>
                    {/* Check In - Check Out */}
                    <div className='flex-1 relative'>
                        <label className='block text-white/80 mb-1 text-sm'>Check In - Check Out</label>
                        <input
                            type='text'
                            name='checkInCheckOut'
                            readOnly
                            value={`${formatDate(range[0].startDate)} - ${formatDate(range[0].endDate)}`}
                            onClick={() => setOpen(!open)}
                            className='w-full p-2 border cursor-pointer focus:outline-none'
                            placeholder='Pilih tanggal'
                        />

                        {/* Hidden input biar bisa dikirim ke backend */}
                        <input type='hidden' name='checkIn' value={formatDate(range[0].startDate)} />
                        <input type='hidden' name='checkOut' value={formatDate(range[0].endDate)} />

                        {open && (
                            <div ref={refOne} className='absolute z-50 mt-2 shadow-lg'>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={handleDateChange}
                                    moveRangeOnFirstSelection={false}
                                    ranges={range}
                                    months={2}
                                    direction='horizontal'
                                    minDate={new Date()}
                                />
                            </div>
                        )}
                    </div>

                    {/* Adult */}
                    <div className='flex-1'>
                        <label className='block text-xs text-white/80 uppercase mb-2'>Adult</label>
                        <input
                            type='number'
                            name='adult'
                            value={adult}
                            onChange={(e) => setAdult(Number(e.target.value))}
                            min='1'
                            className='w-full p-2 border cursor-pointer focus:outline-none'
                        />
                    </div>

                    {/* Children */}
                    <div className='flex-1'>
                        <label className='block text-xs text-white/80 uppercase mb-2'>Children</label>
                        <input
                            type='number'
                            name='children'
                            value={children}
                            onChange={(e) => setChildren(Number(e.target.value))}
                            min='0'
                            className='w-full p-2 border cursor-pointer focus:outline-none'
                        />
                    </div>

                    {/* Room Quantity */}
                    <div className='flex-1'>
                        <label className='block text-xs text-white/80 uppercase mb-2'>Rooms</label>
                        <input
                            type='number'
                            name='roomQuantity'
                            value={roomQuantity}
                            onChange={(e) => setRoomQuantity(Number(e.target.value))}
                            min='1'
                            className='w-full p-2 border cursor-pointer focus:outline-none'
                        />
                    </div>

                    {/* Submit */}
                    <div className='flex-1'>
                        <button
                            type='button'
                            onClick={checkAvailability}
                            disabled={isChecking}
                            className='w-full bg-blue-600 text-white p-2 uppercase font-bold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isChecking ? 'Checking...' : 'Check Availability'}
                        </button>
                    </div>
                </div>

                {/* Availability Status */}
                {isChecking && (
                    <div className='flex items-center gap-2 text-blue-400 text-sm mt-2'>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        <span>Checking room availability...</span>
                    </div>
                )}

                {availabilityStatus && !isChecking && (
                    <div className={`flex items-center gap-2 text-sm mt-2 ${
                        availabilityStatus.available ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {availabilityStatus.available ? (
                            <>
                                <CheckCircle className='w-4 h-4' />
                                <span>{availabilityStatus.message}</span>
                            </>
                        ) : (
                            <>
                                <XCircle className='w-4 h-4' />
                                <span>{availabilityStatus.message}</span>
                            </>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export default BookingForm;
