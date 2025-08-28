import React from 'react';
import Hero from './Hero';
import Navbar from './components/Fragments/Navbar/index';
import Footer from './components/Fragments/Footer';
import AccordionItem from './components/Elements/Accordion/index';
import Accordion from './components/Fragments/Accordion';
import Testimonials from './components/Fragments/Testimonials';

const App = () => {
    return (
        <div>
            <Navbar />
            <Hero></Hero>
            <div className='max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10'>
                <Accordion />
                <Testimonials />
            </div>
            <Footer />
        </div>
    );
};

export default App;
