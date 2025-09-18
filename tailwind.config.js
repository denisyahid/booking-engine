/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lato', 'sans-serif'],
            },
            colors: {
                primary: '#0079FF', 
                secondary: '#FF5722',
            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
};
