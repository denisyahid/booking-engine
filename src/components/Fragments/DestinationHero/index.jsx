import { useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';

export default function DestinationHero({ handleSearch, search, setSearch, location, setLocation }) {
    const [open, setOpen] = useState(false);
    const [destination, setDestination] = useState('Pick a destination');

    const destinations = ['Bali', 'Jakarta', 'Yogyakarta', 'Lombok','Bandung'];

    return (
        <section
            className='relative w-full h-[60vh] md:h-[70vh] bg-cover bg-center flex items-center'
            style={{
                backgroundImage: "url('/images/danau.jpg')", // ganti dengan gambar aslimu
            }}>
            {/* Overlay */}
            <div className='absolute inset-0 bg-black/40'></div>

            {/* Content */}
            <div className='relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full'>
                {/* Title */}
                <h1 className='text-3xl md:text-4xl font-bold text-white mb-6'>Best Tours in</h1>

                {/* Flex Container */}
                <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6'>
                    {/* Destination Dropdown */}
                    <div className='relative'>
                        <select className='w-48 h-12 ps-2 ' name='location' id='location'>
                            <option disabled selected>Pick A Destination</option>
                            {destinations.map((destination,idx) => (
                                <option className='text-gray-500' key={idx} value={destination}>{destination}</option>
                            ))}
                        </select>
                        {/* <button
                            onClick={() => setOpen(!open)}
                            className='flex items-center gap-2 bg-white px-4 py-3 text-gray-700 font-medium shadow-md'>
                            <MapPin className='w-5 h-5 text-blue-600' />
                            {destination}
                            <ChevronDown className='w-4 h-4' />
                        </button>
                        {open && (
                            <div className='absolute left-0 mt-2 w-48 bg-white shadow-lg border'>
                                {destinations.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setDestination(item);
                                            setLocation(item)
                                            setOpen(false);
                                        }}
                                        className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700'>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )} */}
                    </div>

                    {/* Search Box */}
                    <div className='flex flex-1'>
                        <div className='flex items-center bg-white w-full shadow-md'>
                            <Search className='w-5 h-5 text-gray-500 mx-3' />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                name='search'
                                type='search'
                                placeholder='Search for places or activities'
                                className='flex-1 px-2 py-3 text-gray-700 focus:outline-none'
                            />
                            <button className='bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition'>Search</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
