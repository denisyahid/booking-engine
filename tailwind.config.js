/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lato', 'sans-serif'], // ganti default font sans jadi Lato
            },
            colors: {
                primary: '#0079FF', // warna kustom
                secondary: '#FF5722', // contoh tambahan
            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
};
