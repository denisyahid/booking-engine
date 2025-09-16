import { useState } from 'react';
import ErrorElement from '../../Elements/ErrorElement';

export default function AboutSection({ title, description }) {
    const [expanded, setExpanded] = useState(false);

    if (!title) return <ErrorElement />;

    return (
        <section className="w-full bg-gray-50 py-12 md:py-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left Content */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Tentang <span className="ms-1 text-blue-600">{title}</span>
                    </h2>

                    <p className="text-gray-600 leading-relaxed text-justify">
                        {expanded ? description : description.substring(0, 220) + '...'}
                    </p>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800 transition"
                    >
                        {expanded ? 'Sembunyikan ▲' : 'Selengkapnya ▼'}
                    </button>
                </div>

                {/* Right Video */}
                <div className="relative w-full">
                    <div className=" overflow-hidden shadow-lg">
                        <video
                            className="w-full h-64 md:h-80 object-cover"
                            controls
                            src="/videos/ketawa.mp4"
                        ></video>
                    </div>
                </div>
            </div>
        </section>
    );
}
