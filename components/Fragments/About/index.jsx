import { useRef, useState } from 'react';
import ErrorElement from '../../Elements/ErrorElement';
import { Pause, Play, Share2 } from 'lucide-react';

export default function AboutSection({ title, description }) {
    const [expanded, setExpanded] = useState(false);

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const handleToggle = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
            setShowControls(true);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
            setShowControls(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: 'Cek video menarik ini!',
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Gagal share:', error);
            }
        } else {
            // fallback jika browser tidak support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Link telah disalin ke clipboard!');
        }
    };

    if (!title) return <ErrorElement />;

    return (
        <section className='w-full bg-gray-50 py-12 md:py-20'>
            <div className='max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
                {/* Left Content */}
                <div>
                    <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>
                        Tentang <span className='ms-1 text-blue-600'>{title}</span>
                    </h2>

                    <p className='text-gray-600 leading-relaxed text-justify'>{expanded ? description : description.substring(0, 220) + '...'}</p>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className='mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800 transition'>
                        {expanded ? 'Sembunyikan ' : 'Selengkapnya '}
                    </button>
                </div>

                {/* Right Video */}
                <div className='relative w-full'>
                    <div
                        className='overflow-hidden shadow-lg group relative'
                        onMouseEnter={() => setShowControls(true)}
                        onMouseLeave={() => isPlaying && setShowControls(false)}>
                        <video
                            ref={videoRef}
                            className='w-full h-64 md:h-80 object-cover'
                            src='https://encrypted-vtbn0.gstatic.com/video?q=tbn:ANd9GcRkPk8A2EiM8n058JO8e3PcUzcf6YLSBHvBzg'
                            loop></video>

                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // cegah klik masuk ke tombol Play
                                handleShare();
                            }}
                            className='absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 shadow-md hover:bg-blue-700 transition text-sm md:text-base z-20'>
                            <Share2 className='w-4 h-4 inline-block mr-1' />
                            Share
                        </button>

                        {/* Tombol Play/Pause */}
                        {showControls && (
                            <button onClick={handleToggle} className='absolute inset-0 flex items-center justify-center z-10'>
                                <span className='flex items-center justify-center w-14 h-14 transition bg-primary rounded-full shadow-lg hover:bg-primary/80'>
                                    {isPlaying ? (
                                        <Pause className='w-7 h-7 transition text-white' />
                                    ) : (
                                        <Play className='w-7 h-7 transition text-white' />
                                    )}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
