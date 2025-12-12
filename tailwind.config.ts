import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				'primary': '#09282e',
				'secondary': '#004750',
				'greny': '#86df0e',
				'whity': '#d8e8dd',

			},
			fontFamily: {
				sans: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				outfit: ['var(--font-outfit)', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/typography'),
	],
} satisfies Config;
