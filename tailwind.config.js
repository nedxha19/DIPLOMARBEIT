/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#3081b4',
					dark: '#2c6a95',
					light: '#4a9acc'
				},
				accent: {
					DEFAULT: '#ecaecd',
					dark: '#d89bb8',
					light: '#f5c5dd'
				}
			},
			fontFamily: {
				sans: ['Montserrat', 'Inter', 'sans-serif']
			},
			textColor: {
				'deep-purple-accent-400': '#7c3aed'
			}
		}
	},
	plugins: []
};

