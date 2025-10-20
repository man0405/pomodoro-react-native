/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./App.{js,jsx,ts,tsx}",
		"./src/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#fef2f2",
					500: "#ef4444",
					600: "#dc2626",
					700: "#b91c1c",
				},
				secondary: {
					50: "#f0fdf4",
					500: "#22c55e",
					600: "#16a34a",
					700: "#15803d",
				},
			},
		},
	},
	plugins: [],
};
