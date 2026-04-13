import { MapPin, Clock, Share2 } from 'lucide-react';
import Gallery from '../../Elements/Gallery';

const DestinationInfo = ({ destination, destinationImages }) => {
    const handleShare = async () => {
        const shareData = {
            title: destination?.name || 'Destination',
            text: `Yuk cek destinasi menarik: ${destination?.name}!`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Berhasil share!');
            } catch (error) {
                console.error('Gagal share:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link telah disalin ke clipboard!');
            } catch (error) {
                console.error('Clipboard error:', error);
            }
        }
    };

    return (
        <div id='overview' className='w-full bg-gradient-to-r from-primary to-blue-500 text-white relative'>
            {/* Header Top */}
            <div className='max-w-6xl mx-auto px-4 py-6'>
                {/* Title */}
                <h1 className='text-2xl font-bold mb-2'>{destination.name} Tickets</h1>

                {/* Location */}
                <div className='flex items-start gap-2 text-sm mb-1'>
                    <MapPin className='w-4 h-4 mt-0.5' />
                    <p className='leading-snug'>
                        {destination.location || 'Location not specified'}
                    </p>
                </div>

                {/* Rating & Price */}
                <div className='flex items-center gap-4 text-sm mt-2'>
                    {destination.rating > 0 && (
                        <div className='flex items-center gap-1'>
                            <span className='text-yellow-300'>★</span>
                            <span>{destination.rating}/5</span>
                        </div>
                    )}
                    {destination.price > 0 && (
                        <div>
                            <span className='text-white/80'>Starts from:</span>{' '}
                            <span className='font-bold'>IDR {destination.price.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons (top right) */}
                <div className='absolute top-4 right-4 flex gap-2'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                        }}
                        className='bg-white/20 hover:bg-white/30 p-2 rounded-full'>
                        <Share2 className='w-5 h-5' />
                    </button>
                </div>
            </div>

            {/* Gallery */}
            <div className='mx-auto max-w-6xl py-5'>
                <Gallery images={destinationImages} width={'w-full'} height='h-[600px]' />
            </div>
        </div>
    );
};

export default DestinationInfo;
