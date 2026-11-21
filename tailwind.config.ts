import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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

				// Apple-style layering on the Hotmix teal ground:
				// base ground -> elevated surface -> elevated-2 (sheets, popovers)
				'surface': '#0e3238',
				'surface-2': '#143e45',
				// Text hierarchy (label / secondary / tertiary), tinted from the mint, never gray
				'label': '#eef6f1',
				'label-2': 'rgb(216 232 221 / 0.72)',
				'label-3': 'rgb(216 232 221 / 0.48)',
				// Translucent control fills and hairline separators
				'fill': 'rgb(216 232 221 / 0.10)',
				'fill-2': 'rgb(216 232 221 / 0.16)',
				'separator': 'rgb(216 232 221 / 0.12)',
			},
			fontFamily: {
				sans: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				outfit: ['var(--font-outfit)', 'sans-serif'],
			},
			fontSize: {
				// Apple type ramp (size / line-height / tracking)
				'caption': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0' }],
				'footnote': ['0.8125rem', { lineHeight: '1.125rem', letterSpacing: '0' }],
				'subhead': ['0.9375rem', { lineHeight: '1.25rem', letterSpacing: '-0.005em' }],
				'body': ['1.0625rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
				'title-3': ['1.25rem', { lineHeight: '1.625rem', letterSpacing: '-0.015em' }],
				'title-2': ['1.5rem', { lineHeight: '1.875rem', letterSpacing: '-0.02em' }],
				'title-1': ['2rem', { lineHeight: '2.375rem', letterSpacing: '-0.025em' }],
				'large-title': ['2.75rem', { lineHeight: '3.125rem', letterSpacing: '-0.03em' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'card': '1.125rem',
				'sheet': '1.5rem',
			},
			boxShadow: {
				'float': '0 8px 24px -6px rgb(0 0 0 / 0.45), 0 2px 6px -2px rgb(0 0 0 / 0.3)',
				'sheet': '0 -12px 40px -8px rgb(0 0 0 / 0.55)',
			},
			transitionTimingFunction: {
				// iOS sheet / spring-like curve: quick start, long soft settle
				'apple': 'cubic-bezier(0.32, 0.72, 0, 1)',
				'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
			transitionDuration: {
				'250': '250ms',
				'400': '400ms',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/typography'),
		plugin(({ addUtilities }) => {
			addUtilities({
				// Prices and counts: digits that don't jitter
				'.tnum': { 'font-variant-numeric': 'tabular-nums' },
				// Frosted bar material (nav, tab bar, sticky purchase bar): content scrolls beneath it
				'.material-bar': {
					'background-color': 'rgb(9 40 46 / 0.78)',
					'-webkit-backdrop-filter': 'saturate(180%) blur(20px)',
					'backdrop-filter': 'saturate(180%) blur(20px)',
				},
				// Thin material for controls floating over photography
				'.material-thin': {
					'background-color': 'rgb(9 40 46 / 0.55)',
					'-webkit-backdrop-filter': 'saturate(180%) blur(12px)',
					'backdrop-filter': 'saturate(180%) blur(12px)',
				},
				'.pb-safe': { 'padding-bottom': 'env(safe-area-inset-bottom, 0px)' },
			});
		}),
	],
} satisfies Config;
