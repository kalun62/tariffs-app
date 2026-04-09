/** @type {import('tailwindcss').Config} */
	module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",  // пути к твоим компонентам
		"./components/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
		screens: {
			'xs': '375px',  // кастомный брейкпоинт для 375px
		},
		fontSize: {
			'tiny': '14px', // опционально, для удобства
			'sm': '18px',
			'md-lg': '24px',
		},
		},
	},
	plugins: [],
	}