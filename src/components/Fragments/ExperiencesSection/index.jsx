import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Play } from 'lucide-react'; // ikon play

// 🔹 Komponen video card terpisah
function VideoCard({ videoSrc,slug }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // const handlePlay = () => {
    //     if (videoRef.current) {
    //         videoRef.current.play();
    //         setIsPlaying(true);
    //     }
    // };

    return (
        <div className='relative w-full aspect-square bg-gray-200 overflow-hidden shadow-sm'>
            {/* <img className='w-full h-full object-cover' src="/images/room1.jpg" alt="" /> */}
            <video ref={videoRef} className='w-full h-full object-cover' src={videoSrc} controls={false} />
            {!isPlaying && (
                <a href={`/destination/${slug}`} className='absolute inset-0 flex items-center justify-center'>
                    <span className='flex items-center justify-center w-12 h-12 rounded-full bg-primary shadow-lg hover:bg-primary/80 transition'>
                        <Play className='w-6 h-6 text-white' />
                    </span>
                </a>
            )}
        </div>
    );
}

export default function ExperiencesSection({ destinations = [] }) {
    const [visibleCount] = useState(6);
    // const [destination, setDestination] = useState([]);
    const { slug } = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/${slug}/nearby`).then((res) => {
            setDestination(res.data);
        });
    }, [slug]);

    return (
        <section className='w-full max-w-6xl mx-auto py-8'>
            {/* Header */}
            <div className='flex items-center justify-between py-8 mb-4'>
                <h2 className='text-lg md:text-xl font-semibold text-gray-800'>Experiences waiting for you</h2>
                <a href={`/destination`} className='text-blue-600 text-md font-medium hover:underline'>
                    Lihat semua
                </a>
            </div>

            {/* Grid Items */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3'>
                {destinations.length > 0 &&
                    destinations
                        .filter((nearby) => nearby.is_nearby == false)
                        .slice(0, visibleCount)
                        .map((item, idx) => <VideoCard slug={item.slug} key={idx} videoSrc={item.video} />)}
            </div>
        </section>
    );
}
