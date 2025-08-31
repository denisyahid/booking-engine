import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaGlobe } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function HotelCard() {
    const [hotelName, setHotelName] = useState(null);
    const [hotelAddress, setHotelAdress] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const {id} = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/hotel/${id}`)
            .then((res) =>{
                setHotelName(res.data.data.name);
                setHotelAdress(res.data.data.address);
            })
    }, []);

    //   if (!hotel) return <p>Loading...</p>;

    return (
        <div className='bg-slate-100 md:py-10'>
            <div className='max-w-6xl mx-auto bg-white p-6 rounded-2xl border shadow-lg my-10'>
                <h2 className='text-2xl font-bold'>{hotelName}</h2>
                <div className='flex items-center gap-2 text-gray-600 mt-1'>
                    <FaMapMarkerAlt className='text-blue-500' />
                    <span>{hotelAddress}</span>
                    <span className='ml-3 flex text-yellow-400'>
                        {/* {Array.from({ length: hotel.rating }).map((_, i) => (
            <FaStar key={i} />
          ))} */}
                    </span>
                </div>

                <h3 className='mt-4 font-semibold text-lg'>Modern Boutique Industrial Hotel</h3>
                <p className='text-gray-700 mt-2'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat minima sint, eveniet doloribus et nam.
                    {/* {showMore ? hotel.description : hotel.description.substring(0, 150) + "..."} */}
                </p>
                <button onClick={() => setShowMore(!showMore)} className='mt-2 text-blue-600 font-semibold'>
                    {showMore ? 'Show Less' : 'Show More'}
                </button>

                <div className='flex gap-4 mt-4 text-xl'>
                    <a href={''} target='_blank' rel='noreferrer'>
                        <FaFacebook className='text-blue-600' />
                    </a>
                    <a href={''} target='_blank' rel='noreferrer'>
                        <FaInstagram className='text-pink-500' />
                    </a>
                    <a href={''} target='_blank' rel='noreferrer'>
                        <FaYoutube className='text-red-600' />
                    </a>
                    <a href={''} target='_blank' rel='noreferrer'>
                        <FaTiktok />
                    </a>
                    <a href={''} target='_blank' rel='noreferrer'>
                        <FaGlobe />
                    </a>
                </div>
            </div>
        </div>
    );
}
