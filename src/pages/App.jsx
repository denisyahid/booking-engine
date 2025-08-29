import React from 'react';
import Hero from '../Hero';
import Navbar from '../components/Fragments/Navbar/index';
import Footer from '../components/Fragments/Footer';
import AccordionItem from '../components/Elements/Accordion/index';
import Accordion from '../components/Fragments/Accordion';
import Testimonials from '../components/Fragments/Testimonials';
import BioHotel from '../components/Elements/BioHotel';
import RoomCard from '../components/Fragments/RoomCard';
import BookingForm from '../components/Elements/BookingForm';

const App = () => {
    return (
        <div className='bg-slate-100'>
            <Navbar />
            <BioHotel />
            <BookingForm />
            <Hero></Hero>
            <div className='bg-white'>
                <div className='max-w-6xl bg-white mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10'>
                    <Accordion />
                    <Testimonials />
                </div>
            </div>
            <RoomCard />
            <Footer />
        </div>
    );
};

export default App;
