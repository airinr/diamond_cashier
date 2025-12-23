/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warna latar belakang gelap premium (Midnight Slate)
        "diamond-dark": "#0f172a",
        "diamond-darker": "#020617",
        // Warna aksen emas/berlian (Gold/Amber)
        "diamond-accent": "#d4af37", // Warna emas klasik
        "diamond-light": "#fce7f3", // Warna pantulan cahaya pucat
      },
      fontFamily: {
        // Opsional: Jika ingin menggunakan font yang lebih elegan
        // sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
