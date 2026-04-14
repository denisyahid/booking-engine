'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Hero from '../../src/Hero';
import Navbar from '../../components/Fragments/Navbar/index';
import Footer from '../../components/Fragments/Footer';
import BioHotel from '../../components/Elements/BioHotel';
import RoomCard from '../../components/Fragments/RoomCard';
import BookingForm from '../../components/Elements/BookingForm';
import AvailableRooms from '../../components/Elements/AvailableRooms';
import {
    hotelAPI,
    roomAPI,
    facilityAPI,
    rateAPI,
    contentAPI,
} from '../../src/services/api';
import ReviewCarousel from '../../components/Fragments/ReviewCarousel';
import LocationSection from '../../components/Fragments/Location';
import AboutSection from '../../components/Fragments/About';
import Advantage from '../../components/Fragments/Advantage';
import Facilities from '../../components/Fragments/PopularFacilities';
import Policies from '../../components/Fragments/Policies';
import FAQ from '../../components/Fragments/FAQ';
import FloatingAssistant from '../../components/Fragments/FloatingAssistant';

const HotelPage = ({ params }) => {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasSearchParams = searchParams.toString().length > 0;

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

    const [loading, setLoading] = useState(true);
    const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || getToday());
    const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || getTomorrow());
    const [adult, setAdult] = useState(Number(searchParams.get('adult')) || 1);
    const [children, setChildren] = useState(Number(searchParams.get('children')) || 0);
    const [roomQuantity, setRoomQuantity] = useState(Number(searchParams.get('rooms')) || 1);
    const [rooms, setRooms] = useState([]);
    const [roomImages, setRoomImages] = useState([]);
    const [roomFacilities, setRoomFacilities] = useState([]);
    const [roomRates, setRoomRates] = useState([]);
    const [roomRateDates, setRoomRateDates] = useState([]);
    const [discountRoom, setDiscountRoom] = useState([]);
    const [hotel, setHotel] = useState({});
    const [destinations, setDestinations] = useState([]);
    const [hotelImages, setHotelImages] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
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
        hotelAPI.legacyDetail(slug)
            .then((res) => {
                setHotel(res.data);
            })
            .catch(() => {});
    }, [slug]);

    // Hotel Images
    useEffect(() => {
        hotelAPI.legacyImages(slug)
            .then((res) => {
                const images = res.data.map((data) => data.image);
                setHotelImages(images);
            })
            .catch(() => {});
    }, [slug]);

    // Rooms
    useEffect(() => {
        roomAPI.byHotel(slug)
            .then((res) => {
                setRooms(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [slug]);

    // Room Images
    useEffect(() => {
        roomAPI.images()
            .then((res) => {
                setRoomImages(res.data);
            })
            .catch(() => {});
    }, []);

    // Facilities
    useEffect(() => {
        facilityAPI.hotelFacilities(slug)
            .then((res) => {
                try {
                    let facilities = JSON.parse(res.data.facility_name);
                    setRoomFacilities(facilities);
                } catch (e) {
                    setRoomFacilities([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [slug]);

    // Room Rates
    useEffect(() => {
        rateAPI.all()
            .then((res) => {
                setRoomRates(res.data);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        rateAPI.specialRates()
            .then((res) => {
                setRoomRateDates(res.data);
            })
            .catch(() => {});
    }, []);

    // // Room Discount
    useEffect(() => {
        roomAPI.latest(slug)
            .then((res) => {
                setDiscountRoom(res.data);
            })
            .catch(() => {});
    }, [slug]);

    // Nearby & Experiences
    useEffect(() => {
        contentAPI.nearby(slug)
            .then((res) => {
                console.log('📍 Nearby/Experiences data:', res.data);
                setDestinations(res.data || []);
            })
            .catch((err) => {
                console.error('❌ Error fetching nearby/experiences:', err);
                setDestinations([]);
            });
    }, [slug]);

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const handleBook = (e) => {
        const bookingId = e.target.id;
        // Pass booking data via URL query params
        const queryParams = new URLSearchParams({
            checkIn,
            checkOut,
            adult: adult.toString(),
            children: children.toString(),
            rooms: roomQuantity.toString(),
        }).toString();
        router.push(`/booking/${bookingId}?${queryParams}`);
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
                onCheckComplete={setAvailableRooms}
            />
            {/* Available Rooms (muncul setelah check availability) */}
            {availableRooms.length > 0 && (
                <AvailableRooms
                    rooms={availableRooms}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    hotelSlug={slug}
                />
            )}
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
            <ReviewCarousel slug={slug} />
            <Facilities slug={slug} />
            <LocationSection hotel={hotel} slug={slug} destinations={destinations} />
            <Policies slug={slug} />
            <AboutSection description={hotel.description} title={hotel.name} />
            <FAQ slug={slug} />
            <Footer hotel={hotel} />
            <FloatingAssistant />
        </div>
    );
};

export default HotelPage;
