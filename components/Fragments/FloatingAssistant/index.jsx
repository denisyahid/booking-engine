'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, MessageCircle, X, Send, CalendarCheck, UserRound } from 'lucide-react';

export default function FloatingAssistant() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: 'Halo, saya AI Assistant Najjo. Saya bisa bantu cari kamar, cek booking, atau arahkan ke My Bookings.',
        },
    ]);

    const cannedReply = (text) => {
        const normalized = text.toLowerCase();
        if (normalized.includes('booking') || normalized.includes('my booking')) {
            return 'Untuk melihat pesanan Anda, klik tombol My Bookings di bawah.';
        }
        if (normalized.includes('check in') || normalized.includes('checkout') || normalized.includes('tanggal')) {
            return 'Silakan pilih tanggal check-in/check-out di form pencarian kamar pada halaman ini.';
        }
        if (normalized.includes('harga') || normalized.includes('rate') || normalized.includes('promo')) {
            return 'Anda bisa lihat rate dan promo di bagian Available Rooms setelah cek ketersediaan kamar.';
        }
        return 'Terima kasih. Saya siap bantu informasi booking, tanggal menginap, dan navigasi ke My Bookings.';
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input.trim() };
        const botMsg = { role: 'bot', text: cannedReply(input.trim()) };
        setMessages((prev) => [...prev, userMsg, botMsg]);
        setInput('');
    };

    return (
        <>
            {isOpen && (
                <div className='fixed bottom-44 right-4 z-[9999] w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden'>
                    <div className='bg-blue-600 text-white px-4 py-3 flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Bot className='w-5 h-5' />
                            <span className='font-semibold text-sm'>AI Assistant</span>
                        </div>
                        <button type='button' onClick={() => setIsOpen(false)}>
                            <X className='w-4 h-4' />
                        </button>
                    </div>

                    <div className='p-3 h-64 overflow-y-auto bg-gray-50 space-y-2'>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`text-sm px-3 py-2 rounded-xl max-w-[90%] ${
                                    msg.role === 'user'
                                        ? 'ml-auto bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-200'
                                }`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className='p-3 border-t bg-white space-y-2'>
                        <div className='flex gap-2'>
                            <button
                                type='button'
                                onClick={() => router.push('/my-bookings')}
                                className='text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1'>
                                <CalendarCheck className='w-3 h-3' />
                                My Bookings
                            </button>
                            <button
                                type='button'
                                onClick={() => router.push('/profile')}
                                className='text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1'>
                                <UserRound className='w-3 h-3' />
                                Profile
                            </button>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSend();
                                }}
                                placeholder='Tulis pesan...'
                                className='flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200'
                            />
                            <button
                                type='button'
                                onClick={handleSend}
                                className='p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700'>
                                <Send className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='fixed bottom-24 right-4 z-[9999] flex flex-col items-end gap-3'>
                <button
                    type='button'
                    onClick={() => router.push('/my-bookings')}
                    className='h-12 w-12 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 flex items-center justify-center'
                    title='My Bookings'>
                    <CalendarCheck className='w-5 h-5' />
                </button>
                <button
                    type='button'
                    onClick={() => setIsOpen((prev) => !prev)}
                    className='h-14 w-14 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 flex items-center justify-center'
                    title='Chatbot AI'>
                    {isOpen ? <X className='w-6 h-6' /> : <MessageCircle className='w-6 h-6' />}
                </button>
            </div>
        </>
    );
}
