import type { Config } from 'tailwindcss';

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'accent-1': 'var(--accent-1)',
				'accent-2': 'var(--accent-2)',
				'accent-3': 'var(--accent-3)',
				'accent-4': 'var(--accent-4)',
				'accent-5': 'var(--accent-5)',
				'accent-6': 'var(--accent-6)',
				'accent-7': 'var(--accent-7)',
				'accent-8': 'var(--accent-8)',
				'accent-9': 'var(--accent-9)',
				'accent-10': 'var(--accent-10)',
				'accent-11': 'var(--accent-11)',
				'accent-12': 'var(--accent-12)',
			},
			animation: {
				ripple: 'ripple 3400ms ease infinite',
				'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
				'spinner-ease-spin': 'spinner-spin 0.8s ease infinite',
				'spinner-linear-spin': 'spinner-spin 0.8s linear infinite',
			},
			keyframes: {
				ripple: {
					'0%, 100%': {
						transform: 'translate(-50%, -50%) scale(1)',
					},
					'50%': {
						transform: 'translate(-50%, -50%) scale(0.9)',
					},
				},
				'border-beam': {
					'100%': {
						'offset-distance': '100%',
					},
				},
				'spinner-spin': {
					'0%': {
						transform: 'rotate(0deg)',
					},
					'100%': {
						transform: 'rotate(360deg)',
					},
				},
			},
		},
	},
	plugins: [require('tailwindcss-react-aria-components'), require('tailwindcss-animate')],
} satisfies Config;
