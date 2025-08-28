import BookingForm from "./components/Elements/BookingForm";

export default function Hero() {
    const rooms = [
        {
            title: 'Superior King',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            img: '/images/room1.jpg',
        },
        {
            title: 'Superior Twin',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            img: '/images/room2.jpg',
        },
        {
            title: 'Family',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            img: '/images/room3.jpg',
        },
    ];

    return (
        <div>
            {/* HERO */}
            <section
                className='relative bg-center bg-cover flex flex-col justify-end'
                style={{
                    backgroundImage: "url('/images/hero.jpg')",
                    backgroundPosition: 'bottom',
                    height: '700px',
                }}>
                <div className=' max-w-6xl mx-auto px-4 md:px-8'>
                    {/* Booking bar (centered) */}
                    <div className='mx-auto max-w-5xl'>
                      <BookingForm />
                    </div>
                </div>
            </section>

            {/* ROOM CARDS */}
            <section className='max-w-6xl mx-auto px-4 md:px-8 py-12'>
                <h2 className='font-serif text-2xl md:text-3xl mb-8'>Latest Room Deals</h2>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {rooms.map((r, idx) => (
                        <article key={idx} className='bg-white'>
                            <div className='relative overflow-hidden rounded'>
                                {/* NOTE: replace paths /images/roomX.jpg with your real images */}
                                <img src={r.img} alt={r.title} className='w-full h-48 md:h-48 object-cover rounded' />

                                <button className='absolute right-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded'>
                                    Book now
                                </button>
                            </div>

                            <div className='pt-4'>
                                <h3 className='font-serif text-lg mb-2'>{r.title}</h3>
                                <p className='text-sm text-gray-600 mb-4'>{r.desc}</p>
                                <hr className='border-t border-gray-200' />
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
