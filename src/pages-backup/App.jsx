import React, { useEffect, useState } from 'react';
import Hero from '../Hero';
import Navbar from '../components/Fragments/Navbar/index';
import Footer from '../components/Fragments/Footer';
import BioHotel from '../components/Elements/BioHotel';
import RoomCard from '../components/Fragments/RoomCard';
import BookingForm from '../components/Elements/BookingForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewCarousel from '../components/Fragments/ReviewCarousel';
import LocationSection from '../components/Fragments/Location';
import AboutSection from '../components/Fragments/About';
import Advantage from '../components/Fragments/Advantage';
import Facilities from '../components/Fragments/PopularFacilities';
import Policies from '../components/Fragments/Policies';
import FAQ from '../components/Fragments/FAQ';

const App = () => {
    // Fungsi ambil hari ini (format YYYY-MM-DD biar aman ke backend)
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Fungsi ambil besok
    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const hasSearchParams = location.search.length > 0;
    const [loading, setLoading] = useState(true);
    const [checkIn, setCheckIn] = useState(queryParams.get('checkIn') || getToday());
    const [checkOut, setCheckOut] = useState(queryParams.get('checkOut') || getTomorrow());
    const [adult, setAdult] = useState(Number(queryParams.get('adult')) || 1);
    const [children, setChildren] = useState(Number(queryParams.get('children')) || 0);
    const [roomQuantity, setRoomQuantity] = useState(Number(queryParams.get('rooms')) || 1);
    const [rooms, setRooms] = useState([]);
    const [roomImages, setRoomImages] = useState([]);
    const [roomFacilities, setRoomFacilities] = useState([]);
    const [roomRates, setRoomRates] = useState([]);
    const [roomRateDates, setRoomRateDates] = useState([]);
    const [discountRoom, setDiscountRoom] = useState([]);
    const [hotel, setHotel] = useState({});
    const [destinations, setDestinations] = useState([]);
    const [hotelImages, setHotelImages] = useState([]);
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            key: 'selection',
        },
    ]);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Hotel
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/hotel/${slug}`).then((res) => {
            setHotel(res.data);
        });
    }, []);

    // Hotel Images
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/image`).then((res) => {
            const images = res.data.map((data) => data.image);
            setHotelImages(images);
        });
    }, []);

    // Rooms
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/${slug}/room`)
            .then((res) => {
                setRooms(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    // Room Images
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/images').then((res) => {
            setRoomImages(res.data);
        });
    }, []);

    // Facilities
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/facilities`)
            .then((data) => {
                let facilities = JSON.parse(data.facility_name);
                setRoomFacilities(facilities);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    // Room Rates
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/rate`).then((res) => {
            setRoomRates(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/specialrate').then((res) => {
            setRoomRateDates(res.data);
        });
    }, []);

    // // Room Discount
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/latestroom/${slug}`).then((res) => {
            setDiscountRoom(res.data);
            console.log(res.data);
        });
    }, []);

    // Nearby
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/nearby`).then((res) => {
            setDestinations(res.data);
        });
    }, []);

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const handleBook = (e) => {
        const bookingId = e.target.id;
        navigate(`/booking/${bookingId}`, {
            state: {
                bookingId,
                checkIn,
                checkOut,
                adult,
                children,
                roomQuantity,
            },
        });
    };

    const handleDateChange = (item) => {
        let { startDate, endDate } = item.selection;

        if (endDate <= startDate) {
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
        }

        setRange([{ startDate, endDate, key: 'selection' }]);

        // Update ke state App.jsx
        const checkin = new Date(startDate);
        checkin.setDate(startDate.getDate() + 1);
        const checkout = new Date(endDate);
        checkout.setDate(endDate.getDate() + 1);
        const checkIn = checkin.toISOString().split('T')[0];
        const checkOut = checkout.toISOString().split('T')[0];

        setCheckIn(checkIn);
        setCheckOut(checkOut);
    };

    return (
        <div className='bg-white'>
            <Navbar hotel={hotel} />
            <BookingForm
                slug={slug}
                getTodayDate={getTodayDate}
                checkIn={checkIn}
                checkOut={checkOut}
                adult={adult}
                children={children}
                roomQuantity={roomQuantity}
                setCheckIn={setCheckIn}
                setCheckOut={setCheckOut}
                setAdult={setAdult}
                setChildren={setChildren}
                setRoomQuantity={setRoomQuantity}
                rooms={rooms}
                handleDateChange={handleDateChange}
                range={range}
            />
            <BioHotel hotel={hotel} images={hotelImages} />
            {(!hasSearchParams || rooms) && <Hero discount={roomRateDates} roomsByHotel={discountRoom} rooms={discountRoom} roomImages={roomImages} />}
            <RoomCard
                checkIn={checkIn}
                checkOut={checkOut}
                adult={adult}
                children={children}
                handleBook={handleBook}
                formatRupiah={formatRupiah}
                loading={loading}
                rooms={rooms}
                roomImages={roomImages}
                roomFacilities={roomFacilities}
                roomRates={roomRates}
            />
            <Advantage slug={slug} />
            <ReviewCarousel slug={slug} />
            <Facilities slug={slug} />
            <LocationSection hotel={hotel} slug={slug} destinations={destinations} />
            <Policies slug={slug} />
            <AboutSection description={hotel.description} title={hotel.name} />
            <FAQ slug={slug} />
            <Footer hotel={hotel} />
        </div>
    );
};

export default App;
