/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            width: {
                120: '30rem',
                140: '35rem',
                160: '40rem',
            },
        },
        fontFamily: {
            terminal: ['"Meslo"'],
        },
        backgroundColor: {
            toolbar: '#696969',
        },
    },
    plugins: [],
}
