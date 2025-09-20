import { Star } from 'lucide-react';

export default function ReviewSummary({ average = 4.5, total = 522 ,width="max-w-6xl" ,flex= "flex-row",padding = "p-4"}) {
    // konversi ke integer bintang terdekat
    const roundedStars = Math.round(average);

    return (
        <div className={`w-full ${width} mx-auto bg-white ${padding}`}>
            <div className={`flex flex-col md:${flex} items-center md:items-start justify-start`}>
                <div className='flex'>
                {/* Nilai rata-rata */}
                <div className='flex items-end gap-2 me-5'>
                    <span className='text-5xl font-bold'>{average.toFixed(1)}</span>
                    <span className='text-2xl text-gray-500'>/5</span>
                </div>

                {/* Teks + jumlah review */}
                <div className='text-center md:text-left me-5'>
                    <p className='text-xl font-semibold'>Fantastis</p>
                    <p className='text-gray-500'>Dari {total} review</p>
                </div>

                </div>

                {/* Bintang */}
                <div className='flex text-yellow-500 mt-2 md:mt-2'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-6 h-6 ${i < roundedStars ? 'fill-yellow-500' : 'fill-gray-200'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
