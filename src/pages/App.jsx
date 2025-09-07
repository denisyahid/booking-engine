import React, { useEffect, useState } from 'react';
import Hero from '../Hero';
import Navbar from '../components/Fragments/Navbar/index';
import Footer from '../components/Fragments/Footer';
import Accordion from '../components/Fragments/Accordion';
import Testimonials from '../components/Fragments/Testimonials';
import BioHotel from '../components/Elements/BioHotel';
import RoomCard from '../components/Fragments/RoomCard';
import BookingForm from '../components/Elements/BookingForm';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewCarousel from '../components/Fragments/ReviewCarousel';
import ReviewSummary from '../components/Elements/ReviewSummary';
import LocationSection from '../components/Fragments/Location';
import AboutSection from '../components/Fragments/About';
import Advantage from '../components/Fragments/Advantage';
import PopularFacilities from '../components/Fragments/PopularFacilities';
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
            <PopularFacilities />
            <LocationSection />
            <Policies />
            <AboutSection description={hotel.description} title={hotel.name} />
            <FAQ />
            <Footer />
        </div>
    );
};

export default App;
