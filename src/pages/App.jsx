import React, { useEffect, useState } from 'react';
// import Hero from '../Hero';
const Hero = React.lazy(() => import('../Hero'));
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
import Policies from '../components/Fragments/Policies'
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
    const [rooms, setRooms] = useState([]);
    const [roomFacilities, setRoomFacilities] = useState([]);
    const [roomRates, setRoomRates] = useState([]);
    const [hotel, setHotel] = useState({});
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

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/hotel/${slug}`).then((res) => {
            setHotel(res.data);
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

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const handleBook = (e) => {
        console.log(checkIn, checkOut);
        const bookingId = e.target.id;
        navigate(`/booking/${bookingId}`, {
            state: {
                bookingId,
                checkIn,
                checkOut,
                adult,
                children,
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
        checkin.setDate(startDate.getDate() + 1)
        const checkIn = checkin.toISOString().split('T')[0];
        const checkOut = endDate.toISOString().split('T')[0];

        setCheckIn(checkIn);
        setCheckOut(checkOut);
    };

    return (
        <div className='bg-white'>
            <Navbar />
            <BookingForm
                slug={slug}
                getTodayDate={getTodayDate}
                checkIn={checkIn}
                checkOut={checkOut}
                adult={adult}
                children={children}
                setCheckIn={setCheckIn}
                setCheckOut={setCheckOut}
                setAdult={setAdult}
                setChildren={setChildren}
                rooms={rooms}
                handleDateChange={handleDateChange}
                range={range}
            />
            <BioHotel />
            {(!hasSearchParams || rooms) && <Hero roomsByHotel={rooms} />}
            <RoomCard
                checkIn={checkIn}
                checkOut={checkOut}
                adult={adult}
                children={children}
                handleBook={handleBook}
                formatRupiah={formatRupiah}
                loading={loading}
                rooms={rooms}
                roomFacilities={roomFacilities}
                roomRates={roomRates}
            />
            <Advantage />
            <ReviewCarousel />
            <Facilities />
            <LocationSection />
            <Policies />
            <AboutSection description={hotel.description} title={hotel.name} />
            <FAQ />
            <Footer />
        </div>
    );
};

export default App;
