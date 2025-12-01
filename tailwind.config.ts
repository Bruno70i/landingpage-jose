import type { Config } from 'tailwindcss'

export default <Config>{
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue'
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    950: '#020c1b', // Deepest Ocean Blue (Background)
                    900: '#0a192f',
                    800: '#112240',
                },
                cyan: {
                    DEFAULT: '#64ffda', // Neon Cyan
                    glow: 'rgba(100, 255, 218, 0.1)',
                },
                orange: {
                    DEFAULT: '#ff4d00', // Safety Orange
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.05)',
                    border: 'rgba(255, 255, 255, 0.1)',
                }
            },
            fontFamily: {
                sans: ['Rajdhani', 'sans-serif'], // Industrial/Sci-fi feel
                mono: ['Fira Code', 'monospace'],
                display: ['Oswald', 'sans-serif'], // Bold headers
            },
            boxShadow: {
                'neon': '0 0 10px rgba(100, 255, 218, 0.5), 0 0 20px rgba(100, 255, 218, 0.3)',
                'neon-orange': '0 0 10px rgba(255, 77, 0, 0.5), 0 0 20px rgba(255, 77, 0, 0.3)',
            }
        },
    },
    plugins: [],
}
