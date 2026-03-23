/** @type {import('tailwindcss').Config} */
// tailwind.config.js (del Dashboard descargado)
const colors = require('tailwindcss/colors')

module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                // Mapeamos tus variables CSS a alias técnicos dentro de Tailwind
                'primary-gov': 'var(--color-base-01)',
                'secondary-gov': 'var(--color-base-02)',
                'accent-gov': 'var(--color-base-03)',
                'neutral-gov': 'var(--color-base-04)',

                // OPCIONAL: Si el Dashboard usa un color específico para el Sidebar, cámbialo aquí
                // 'sidebar-bg': 'var(--color-base-01)', // Descomenta si quieres el Sidebar Guinda
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        // require("daisyui"), // Si la plantilla usa DaisyUI, asegúrate de configurar su tema también
    ],
}