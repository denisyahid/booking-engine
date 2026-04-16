const GeneralInfo = ({ destination }) => {
    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (
        destination.destination_rate && (
            <div id="about" className='w-full max-w-6xl mx-auto py-6 flex my-10'>
                <div className='w-1/3 max-w-6xl mx-auto`'>
                    {/* Judul */}
                    <h2 className='text-xl font-semibold mb-4'>General Information</h2>

                    {/* Isi Informasi */}
                    <div className='space-y-3 text-sm sm:text-base'>
                        <div className='flex flex-col sm:flex-row'>
                            <span className='w-40 font-semibold'>Ticket Price</span>
                            <span>{formatRupiah(destination.destination_rate?.price)}</span>
                        </div>

                        <div className='flex flex-col sm:flex-row'>
                            <span className='w-40 font-semibold'>Opening Hours</span>
                            <span>{destination.open_hours}</span>
                        </div>

                        <div className='flex flex-col sm:flex-row'>
                            <span className='w-40 font-semibold'>Address</span>
                            <span>{destination.location}</span>
                        </div>

                        {/* <div className='flex flex-col sm:flex-row'>
                    <span className='w-40 font-semibold'>Public Facilities</span>
                    <span>{destination.facilities.join(', ')}</span>
                </div> */}

                        {/* <div className='flex flex-col sm:flex-row'>
                        <span className='w-40 font-semibold'>Category</span>
                        <span>{destination.category}</span>
                    </div> */}
                    </div>
                </div>
                <div className='w-2/3'>
                    <h2 className='text-xl font-semibold mb-4'>Location</h2>

                    <iframe
                        title='map'
                        src={`${destination.maps}`}
                        className='w-full h-64 sm:h-80 lg:h-full shadow'
                        allowFullScreen=''
                        loading='lazy'></iframe>
                </div>
            </div>
        )
    );
};

export default GeneralInfo;
