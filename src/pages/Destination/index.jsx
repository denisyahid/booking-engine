import axios from 'axios';
import { useEffect, useState } from 'react';

const destinations = [
    {
        id: 1,
        title: 'Derawan Whale Shark Labuan Cermin Tours - 4 Days 3 Nights',
        location: 'Derawan, Berau',
        rating: 7.0,
        reviews: 2,
        price: 4014700,
        oldPrice: 5100000,
        discount: 20,
        img: 'https://via.placeholder.com/400x250?text=Derawan',
    },
    {
        id: 2,
        title: 'Mount Bromo Sunrise Tour - 1 Day',
        location: 'Bromo (AREA)',
        rating: 8.9,
        reviews: 774,
        price: 322230,
        oldPrice: 431000,
        discount: 25,
        img: 'https://via.placeholder.com/400x250?text=Bromo',
    },
    {
        id: 3,
        title: 'Ijen Crater Tour',
        location: 'Licin, Banyuwangi',
        rating: 9.5,
        reviews: 56,
        price: 180630,
        oldPrice: 350000,
        discount: 50,
        img: 'https://via.placeholder.com/400x250?text=Ijen',
    },
];

export default function DestinationPage() {
    const [filters, setFilters] = useState({
        price: [0, 2000000],
        types: {
            nature: false,
            sightseeing: false,
            culture: false,
            water: false,
            site: false,
            culinary: false,
            themed: false,
        },
    });
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/destination').then((res) => {
            setDestinations(res.data);
        });
    }, []);

    return (
        <div className='w-full bg-gray-50 py-6 md:py-10'>
            <div className='max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
                {/* Sidebar */}
                <aside className='col-span-1 bg-white border p-4 h-fit'>
                    <h3 className='font-bold text-gray-800 mb-3'>Price Range</h3>
                    <select className='w-full border px-2 py-1'>
                        <option>Rp 0 - Rp 2.000.000+</option>
                    </select>

                    {/* <h3 className='font-bold text-gray-800 mt-6 mb-3'>Xperience Highlights</h3>
                    <label className='flex items-center gap-2'>
                        <input type='checkbox' defaultChecked />
                        <span>New in Xperience</span>
                    </label> */}

                    <h3 className='font-bold text-gray-800 mt-6 mb-3'>Type of activities or items</h3>
                    {Object.keys(filters.types).map((type) => (
                        <label key={type} className='flex items-center gap-2'>
                            <input
                                type='checkbox'
                                checked={filters.types[type]}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        types: {
                                            ...filters.types,
                                            [type]: !filters.types[type],
                                        },
                                    })
                                }
                            />
                            <span className='capitalize'>{type} Tours</span>
                        </label>
                    ))}
                </aside>

                {/* Main Content */}
                <main className='col-span-1 md:col-span-3'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-lg md:text-xl font-bold text-gray-800'>50 best Tours in Xperience</h2>
                        <select className='border px-2 py-1'>
                            <option>Most Popular</option>
                            <option>Lowest Price</option>
                            <option>Highest Rating</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {destinations.map((item) => (
    <article key={item.id} className="w-full flex-shrink-0">
      <div className="bg-white shadow overflow-hidden">
        <div className="relative">
          {item.destination_image.length > 0 ? (
            <img
              loading="lazy"
              src={`http://127.0.0.1:8000/storage/${item.destination_image[0].image}`}
              alt={item.name}
              className="w-full h-48 md:h-56 object-cover"
            />
          ) : (
            <img
              loading="lazy"
              src="https://via.placeholder.com/400x250?text=No+Image"
              alt={item.name}
              className="w-full h-48 md:h-56 object-cover"
            />
          )}
        </div>

        <div className="pt-4 p-4">
          <h3 className="font-sans text-lg mb-2">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {item.description
              ? item.description.substring(0, 100) + "..."
              : "No description available"}
          </p>
          <hr className="border-t border-gray-200" />
        </div>
      </div>
    </article>
  ))}
</div>

                </main>
            </div>
        </div>
    );
}
