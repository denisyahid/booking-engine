import { MapPin, Clock, Bookmark, Share2, Image } from "lucide-react";
import Gallery from "../../Elements/Gallery";

const DestinationInfo = ({destination,destinationImages}) => {
    return (
        <div className='w-full bg-gradient-to-r from-primary to-blue-500 text-white mt-16'>
            {/* Header Top */}
            <div className='max-w-6xl mx-auto px-4 py-6 relative'>
                {/* Title */}
                <h1 className='text-2xl font-bold mb-2'>{destination.name} Tickets</h1>

                {/* Location */}
                <div className='flex items-start gap-2 text-sm mb-1'>
                    <MapPin className='w-4 h-4 mt-0.5' />
                    <p className='leading-snug'>
                        {destination.location}
                        <a href={`${destination.maps}`} className='text-lime-400 font-semibold ml-1'>Show Map</a>
                    </p>
                </div>

                {/* Opening Hours */}
                <div className='flex items-center gap-2 text-sm'>
                    <Clock className='w-4 h-4' />
                    <p>
                        Opening hours: <span className='font-bold'>10:00–18:00</span>{' '}
                        {/* <button className='text-lime-400 font-semibold'>See Opening Hours</button> */}
                    </p>
                </div>

                {/* Action Buttons (top right) */}
                <div className='absolute top-4 right-4 flex gap-2'>
                    <button className='bg-white/20 hover:bg-white/30 p-2 rounded-full'>
                        <Bookmark className='w-5 h-5' />
                    </button>
                    <button className='bg-white/20 hover:bg-white/30 p-2 rounded-full'>
                        <Share2 className='w-5 h-5' />
                    </button>
                </div>
            </div>

            {/* Gallery */}
            <div className="mx-auto max-w-6xl py-5">
            <Gallery images={destinationImages} width={"w-full"} height="h-[500px]" />
            </div>
        </div>
    );
};

export default DestinationInfo;