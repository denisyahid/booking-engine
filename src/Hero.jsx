import React from "react";

export default function Hero() {
  const rooms = [
    {
      title: "Superior King",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      img: "/images/room1.jpg",
    },
    {
      title: "Superior Twin",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      img: "/images/room2.jpg",
    },
    {
      title: "Family",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      img: "/images/room3.jpg",
    },
  ];

  return (
    <div>
      {/* HERO */}
      <section
        className="relative bg-center bg-cover min-h-screen"
        style={{
          backgroundImage: "url('/images/hero.jpg')",backgroundPosition:"bottom"
        }}
      >
        {/* layer to darken background for contrast */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className=" max-w-6xl mx-auto px-4 md:px-8 py-20">
          {/* Booking bar (centered) */}
          <div className="mx-auto max-w-5xl">
            <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-black/40">
              <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-xs text-white/80 uppercase mb-2">Check in</label>
                  <input
                    type="date"
                    defaultValue="2025-08-28"
                    className="w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/80 uppercase mb-2">Check out</label>
                  <input
                    type="date"
                    defaultValue="2025-08-29"
                    className="w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/80 uppercase mb-2">Check out</label>
                  <input
                    type="date"
                    defaultValue="2025-08-29"
                    className="w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-white/80 uppercase mb-2">Check</label>
                    <input
                      type="date"
                      defaultValue="2025-08-29"
                      className="w-full bg-white rounded-md px-3 py-2 text-sm shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
                  >
                    CARI
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ROOM CARDS */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <h2 className="font-serif text-2xl md:text-3xl mb-8">Latest Room Deals</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((r, idx) => (
            <article key={idx} className="bg-white">
              <div className="relative overflow-hidden rounded">
                {/* NOTE: replace paths /images/roomX.jpg with your real images */}
                <img
                  src={r.img}
                  alt={r.title}
                  className="w-full h-48 md:h-48 object-cover rounded"
                />

                <button className="absolute right-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded">
                  Book now
                </button>
              </div>

              <div className="pt-4">
                <h3 className="font-serif text-lg mb-2">{r.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{r.desc}</p>
                <hr className="border-t border-gray-200" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
