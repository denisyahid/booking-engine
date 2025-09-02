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

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [checkIn, setCheckIn] = useState(queryParams.get('checkIn') || '');
    const [checkOut, setCheckout] = useState(queryParams.get('checkOut') || '');
    const [adult, setAdult] = useState(Number(queryParams.get('adult')) || 0);
    const [children, setChildren] = useState(Number(queryParams.get('children')) || 0);
    const { slug } = useParams();
    const hasSearchParams = location.search.length > 0;
    const [rooms, setRooms] = useState([]);
    const [roomFacilities, setRoomFacilities] = useState([]);
    const [roomRates, setRoomRates] = useState([]);
    const [loading, setLoading] = useState(true);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/${slug}/room`)
            .then((res) => {
                setRooms(res.data);
                console.log(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

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

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/rate`).then((res) => {
            setRoomRates(res.data);
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
            },
        });
    };

    return (
        <div className='bg-white'>
            <Navbar />
            <BioHotel />
            <BookingForm
                slug={slug}
                getTodayDate={getTodayDate}
                checkIn={checkIn}
                checkOut={checkOut}
                adult={adult}
                children={children}
                setCheckIn={setCheckIn}
                setCheckout={setCheckout}
                setAdult={setAdult}
                setChildren={setChildren}
            />
            {!hasSearchParams && <Hero />}
            {!hasSearchParams && (
                <div className='bg-white'>
                    <div className='max-w-6xl bg-white mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10'>
                        <Accordion />
                        <Testimonials />
                    </div>
                </div>
            )}
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
            <Footer />
        </div>
    );
};

export default App;
