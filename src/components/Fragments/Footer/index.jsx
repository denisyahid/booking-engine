import { Mail, Phone } from "lucide-react";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-500 text-white px-6 md:px-16 lg:px-24 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Bagian Kiri */}
        <div>
          <h2 className="text-5xl font-bold mb-4">MY HOTEL</h2>
          <p className="text-lg mb-6">MY HOTEL GROUP</p>
          <p className="text-sm leading-relaxed">
            
          </p>
          <div className="mt-6 space-y-2">
            <p className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" /> info@myhotels.com
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" /> 02129181091
            </p>
          </div>
        </div>

        {/* Bagian Tengah */}
        <div className="space-y-3">
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:underline">Careers</a>
            </li>
            <li>
              <a href="#" className="hover:underline">News & Media</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Site Map</a>
            </li>
          </ul>
        </div>

        {/* Bagian Kanan */}
        <div className="space-y-4">
          <p className="font-semibold">FOLLOW US :</p>
          <div className="flex gap-4">
            <a href="#"><FaInstagram size={22} /></a>
            <a href="#"><FaYoutube size={22} /></a>
            <a href="#"><FaLinkedin size={22} /></a>
          </div>
          <div className="mt-4 flex">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full p-2 rounded-l-md text-black outline-none"
            />
            <button className="bg-gray-700 hover:bg-gray-800 px-4 rounded-r-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
