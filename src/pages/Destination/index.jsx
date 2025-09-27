import axios from 'axios';
import { useEffect, useState } from 'react';
import DestinationNavbar from '../../components/Fragments/DestinationNavbar';
import DestinationHero from '../../components/Fragments/DestinationHero';
import Footer from '../../components/Fragments/Footer';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Mail, Phone } from 'lucide-react';

export default function DestinationPage() {
    const [filters, setFilters] = useState({
        priceRange: '0-100000',
        type: [], // sekarang array
        sort: 'popular',
    });
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search,setSearch] = useState("");
    const [location,setLocation] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        axios.get('http://127.0.0.1:8000/api/destination',{
            params: {
                search: e.target.search.value,
                location: e.target.location.value
            }
        })
        .then((res) => {
            setDestinations(res.data)
            
        })
    }

    const priceRanges = [
        { title: '0 - Rp.100.000', value: '0-100000' },
        { title: 'Rp.100.000 - Rp.200.000', value: '100000-200000' },
        { title: 'Rp.200.000 - Rp.300.000', value: '200000-300000' },
    ];

    const destinationTypes = [
        { title: 'Nature', value: 'nature' },
        { title: 'Beach', value: 'beach' },
        { title: 'Culinery', value: 'culinery' },
        { title: 'Culture', value: 'culture' },
    ];

    // Fetch default data
    useEffect(() => {
        setLoading(true);
        axios
            .get('http://127.0.0.1:8000/api/destination')
            .then((res) => {
                setDestinations(Array.isArray(res.data) ? res.data : []);
                console.log(res.data);
                console.log(filters);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // Fetch data setiap filter berubah
    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/api/destination/search', { params: filters })
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
                setDestinations(data);
            })
            .catch((err) => {
                console.error(err);
                setDestinations([]);
            });
    }, [filters]);

    const handleTypeChange = (value, checked) => {
        if (checked) {
            setFilters((prev) => ({
                ...prev,
                type: [...prev.type, value], // tambahkan
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                type: prev.type.filter((t) => t !== value), // hapus
            }));
        }
    };

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return (
        <>
            <DestinationNavbar />
            <DestinationHero search={search} setSearch={setSearch} location={location} setLocation={setLocation} handleSearch={handleSearch} />
            <div className='w-full bg-gray-50 py-6 md:py-10 mt-14'>
                <div className='max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-6'>
                    {/* Main Content */}
                    <main className='col-span-1 md:col-span-3'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg md:text-xl font-bold text-gray-800'>Destinations</h2>
                            <select
                                value={filters.sort}
                                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                className='border px-2 py-1'>
                                <option value='popular'>Most Popular</option>
                                <option value='price_asc'>Lowest Price</option>
                                <option value='price_desc'>Highest Rating</option>
                            </select>
                        </div>

                        {loading ? (
                            <p className='text-gray-500'>Loading...</p>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {destinations.map((item) => (
                                    <a key={item.id} href={`/destination/${item.slug}`}>
                                        <article className='w-full flex-shrink-0 border'>
                                            <div className='bg-white shadow overflow-hidden'>
                                                <div className='relative'>
                                                    {item.destination_image?.length > 0 ? (
                                                        <img
                                                            loading='lazy'
                                                            src={item.destination_image[0].image}
                                                            alt={item.name}
                                                            className='w-full h-48 md:h-56 object-cover'
                                                        />
                                                    ) : (
                                                        <img
                                                            loading='lazy'
                                                            src='https://via.placeholder.com/400x250?text=No+Image'
                                                            alt={item.name}
                                                            className='w-full h-48 md:h-56 object-cover'
                                                        />
                                                    )}
                                                </div>

                                                <div className='pt-4 p-4'>
                                                    <h3 className='font-sans text-lg'>{item.name}</h3>
                                                    <p className='my-1 text-gray-700 font-medium text-sm'>{item.location}</p>
                                                    <p className='text-xs text-gray-600 mb-2'>
                                                        {item.description ? item.description.substring(0, 100) + '...' : 'No description available'}
                                                    </p>
                                                    <p className='text-sm text-gray-600'>Start from</p>
                                                    <h3 className='text-primary font-semibold'>
                                                        {item.destination_rates ? formatRupiah(item.destination_rates[0].price) : 'N/A'}
                                                    </h3>
                                                </div>
                                            </div>
                                        </article>
                                    </a>
                                ))}
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className='col-span-1 bg-white border p-4 h-fit'>
                        <h3 className='font-bold text-gray-800 mb-3'>Price Range</h3>
                        <select
                            className='w-full border px-2 py-1'
                            value={filters.priceRange}
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}>
                            {priceRanges.map((price, idx) => (
                                <option key={idx} value={price.value}>
                                    {price.title}
                                </option>
                            ))}
                        </select>

                        <h3 className='font-bold text-gray-800 mt-6 mb-3'>Type of activities or items</h3>
                        {destinationTypes.map((type, idx) => (
                            <label key={idx} className='block'>
                                <input
                                    type='checkbox'
                                    value={type.value}
                                    checked={filters.type.includes(type.value)}
                                    onChange={(e) => handleTypeChange(type.value, e.target.checked)}
                                />{' '}
                                {type.title}
                            </label>
                        ))}
                    </aside>
                </div>
            </div>
            <footer className='bg-primary text-white px-6 md:px-16 lg:px-24 py-10'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                    {/* Bagian Kiri */}
                    <div>
                        <h2 className='text-4xl font-bold mb-4'>Najjo</h2>
                        <p className='text-lg mb-6'>Najjo GROUP</p>
                        <p className='text-sm leading-relaxed'></p>
                        <div className='mt-6 space-y-2'>
                            <p className='flex items-center gap-2 text-sm'>
                                <Mail className='w-4 h-4' /> najjo@gmail.com
                            </p>
                            <p className='flex items-center gap-2 text-sm'>
                                <Phone className='w-4 h-4' /> 12345678
                            </p>
                        </div>
                    </div>

                    {/* Bagian Tengah */}
                    <div className='space-y-3'>
                        <ul className='space-y-3'>
                            <li>
                                <a href='#' className='hover:underline'>
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href='#' className='hover:underline'>
                                    News & Media
                                </a>
                            </li>
                            <li>
                                <a href='#' className='hover:underline'>
                                    Site Map
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Bagian Kanan */}
                    <div className='space-y-4'>
                        <p className='font-semibold'>FOLLOW US :</p>
                        <div className='flex gap-4'>
                            <a href='#'>
                                <FaInstagram size={22} />
                            </a>
                            <a href='#'>
                                <FaYoutube size={22} />
                            </a>
                            <a href='#'>
                                <FaLinkedin size={22} />
                            </a>
                        </div>
                        <div className='mt-4 flex'>
                            <input type='email' placeholder='Enter Your Email' className='w-full p-2 text-black outline-none' />
                            <button className='bg-gray-700 hover:bg-gray-800 px-4 '>Subscribe</button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
