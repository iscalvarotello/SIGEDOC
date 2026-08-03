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
                
                // Colores Institucionales Dinámicos (Atados al ThemeService)
                'theme-primary': 'var(--theme-primary, #691C32)',
                'theme-secondary': 'var(--theme-secondary, #BC955C)',
                
                // Semánticos del Tema
                'theme-success': 'var(--theme-success, #10B981)',
                'theme-warning': 'var(--theme-warning, #F59E0B)',
                'theme-danger': 'var(--theme-danger, #EF4444)',
                'theme-info': 'var(--theme-info, #3B82F6)',
                
                // Mantenemos guinda y dorado para compatibilidad hacia atrás si hay componentes crudos
                'theme-guinda': '#691C32',
                'theme-dorado': '#BC955C',
            },
            fontSize: {
                'theme-title': 'var(--theme-title-size, 2.25rem)', // 4xl por defecto
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        // require("daisyui"), // Si la plantilla usa DaisyUI, asegúrate de configurar su tema también
    ],
}