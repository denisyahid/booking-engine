import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import DestinationInfo from '../../components/Fragments/DestinationInfo';
import Navbar from '../../components/Fragments/Navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function BlogPage() {
    const [hotel,setHotel] = useState({});
    const [destination,setDestination] = useState({});
    const {slug} = useParams();

    // Hotel
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/hotel/${slug}`).then((res) => {
            setHotel(res.data);
        });
    }, []);

    // Destination
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/${slug}`).then((res) => {
            setDestination(res.data);
        });
    }, []);

    return (
        <div className='w-full text-gray-800'>
            {/* <Navbar hotel={hotel} /> */}
            <DestinationInfo />
        </div>
    );
}

// ---------------- Gallery ----------------
function GallerySection() {
    return (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-1 h-[300px] md:h-[400px]'>
            <img src='/images/dufan1.jpg' className='w-full h-full object-cover' />
            <img src='/images/dufan2.jpg' className='w-full h-full object-cover' />
            <img src='/images/dufan3.jpg' className='w-full h-full object-cover' />
            <img src='/images/dufan4.jpg' className='w-full h-full object-cover' />
        </div>
    );
}

// ---------------- Sticky Navbar ----------------
function StickyNavbar() {
    const [active, setActive] = useState('overview');
    const tabs = ['Overview', 'Ticket Options', 'About', 'Reviews', 'FAQs'];

    return (
        <div className='sticky top-0 bg-white shadow z-50'>
            <div className='flex gap-6 overflow-x-auto px-4 py-3 text-sm font-medium'>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActive(tab)}
                        className={`${active === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'} pb-1`}>
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ---------------- Harga ----------------
function PriceSection() {
    return (
        <div>
            <h2 className='text-xl font-semibold mb-2'>Ticket Options</h2>
            <div className='border p-4 flex items-center justify-between'>
                <div>
                    <p className='font-medium'>Dufan Ancol Weekday Ticket</p>
                    <p className='text-gray-500 text-sm'>Valid for 1 day entry</p>
                </div>
                <div className='text-right'>
                    <p className='text-lg font-bold text-orange-600'>Rp 150.000</p>
                    <button className='bg-blue-600 text-white px-4 py-2 mt-2'>Book Now</button>
                </div>
            </div>
        </div>
    );
}

// ---------------- What You'll Experience ----------------
function ExperienceSection() {
    return (
        <div>
            <h2 className='text-xl font-semibold mb-2'>What You'll Experience</h2>
            <ul className='list-disc list-inside space-y-1 text-gray-700'>
                <li>Explore 30+ rides and attractions</li>
                <li>Family friendly entertainment</li>
                <li>Located inside Ancol Dreamland</li>
            </ul>
        </div>
    );
}

// ---------------- Experiences waiting for you ----------------
function VideoExperienceSection() {
    const videos = ['/videos/ride1.mp4', '/videos/ride2.mp4', '/videos/ride3.mp4'];
    return (
        <div>
            <h2 className='text-xl font-semibold mb-2'>Experiences waiting for you</h2>
            <div className='grid grid-cols-2 md:grid-cols-6 gap-3'>
                {videos.map((src, idx) => (
                    <VideoCard key={idx} videoSrc={src} />
                ))}
            </div>
        </div>
    );
}

function VideoCard({ videoSrc }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const handlePlay = (e) => {
        const video = e.target.previousSibling;
        if (!isPlaying) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };
    return (
        <div className='relative w-full aspect-square bg-gray-200 overflow-hidden shadow'>
            <video className='w-full h-full object-cover' src={videoSrc} />
            <button onClick={handlePlay} className='absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition'>
                <Play className='w-8 h-8 text-white' />
            </button>
        </div>
    );
}

// ---------------- Lokasi ----------------
function LocationSection() {
    return (
        <div>
            <h2 className='text-xl font-semibold mb-2'>Location</h2>
            <iframe
                title='map'
                src='https://maps.google.com/maps?q=dufan%20ancol&t=&z=13&ie=UTF8&iwloc=&output=embed'
                className='w-full h-64 border'
            />
            <p className='text-gray-600 text-sm mt-2'>Taman Impian Jaya Ancol, Jakarta Utara, Indonesia</p>
        </div>
    );
}

// ---------------- FAQ ----------------
function FAQSection() {
    const faqs = [
        { q: 'Is re-entry allowed?', a: 'No, re-entry is not allowed after leaving the park.' },
        { q: 'Are food and drinks allowed?', a: 'Outside food and drinks are not permitted.' },
    ];
    return (
        <div>
            <h2 className='text-xl font-semibold mb-2'>FAQs</h2>
            <div className='space-y-3'>
                {faqs.map((faq, idx) => (
                    <div key={idx} className='border p-3'>
                        <p className='font-medium'>{faq.q}</p>
                        <p className='text-sm text-gray-600'>{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------- Reviews ----------------
function ReviewsSection() {
    const reviews = [
        { name: 'Andi', text: 'Seru banget, wahana lengkap dan cocok untuk keluarga.' },
        { name: 'Sinta', text: 'Anak-anak senang, pelayanan bagus.' },
    ];
    return (
        <div>
            <h2 className='text-xl font-semibold mb-2'>What People Say</h2>
            <div className='space-y-3'>
                {reviews.map((r, idx) => (
                    <div key={idx} className='border p-3'>
                        <p className='font-medium'>{r.name}</p>
                        <p className='text-gray-700 text-sm'>{r.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------- About ----------------
function AboutSection() {
    return (
        <div>
            <h2 className='text-xl font-semibold mb-2'>About Dufan Ancol</h2>
            <p className='text-gray-700 text-sm leading-relaxed'>
                Dufan Ancol is Jakarta’s most famous amusement park featuring thrilling rides, attractions, and family-friendly entertainment located
                in Ancol Dreamland.
            </p>
        </div>
    );
}
