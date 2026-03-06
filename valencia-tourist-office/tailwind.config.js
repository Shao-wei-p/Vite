/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aquí podrías extender el tema si quisieras colores personalizados específicos
      colors: {
        // Ejemplo: 'valencia-orange': '#ff6b00',
      }
    },
  },
  plugins: [],
}
