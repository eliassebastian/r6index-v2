import {
	Button as RACButton,
	ButtonProps as RACButtonProps,
	Link as RACLink,
	LinkProps as RACLinkProps,
	composeRenderProps,
} from 'react-aria-components';

import { tv } from 'tailwind-variants';
import { focusRing } from './utils';

const button = tv({
	extend: focusRing,
	base: 'px-5 py-2 text-sm text-center transition rounded-lg cursor-default',
	variants: {
		variant: {
			primary:
				'bg-accent-3 hover:bg-accent-4 border-[0.5px] border-accent-7 pressed:bg-accent-5 hover:border-accent-8 text-accent-12',
			secondary:
				'bg-[#858e8b] hover:bg-[#7b8481] border-[0.5px] border-accent-7 pressed:bg-[#717877] hover:border-accent-8 text-[#19211e]',
			ghost: 'bg-transparent hover:bg-accent-4 pressed:bg-accent-5 text-accent-12',
			outline:
				'bg-transparent border-[0.5px] border-accent-7 hover:bg-accent-4 pressed:bg-accent-5 hover:border-accent-8 text-accent-12',
			destructive: 'bg-red-700 hover:bg-red-800 pressed:bg-red-900 text-white',
			icon: 'border-0 p-1 flex items-center justify-center text-gray-600 hover:bg-black/[5%] pressed:bg-black/10 dark:text-zinc-400 dark:hover:bg-white/10 dark:pressed:bg-white/20 disabled:bg-transparent',
		},
		isDisabled: {
			true: 'bg-accent-3 border-[0.5px] border-accent-7 hover:border-accent-8 text-accent-12',
		},
	},
	defaultVariants: {
		variant: 'primary',
	},
});

export interface ButtonProps extends RACButtonProps {
	variant?: keyof typeof button.variants.variant;
}

export function Button(props: ButtonProps) {
	return (
		<RACButton
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				button({ ...renderProps, variant: props.variant, className }),
			)}
		/>
	);
}

export interface LinkProps extends RACLinkProps {
	variant?: keyof typeof button.variants.variant;
}

export function Link(props: LinkProps) {
	return (
		<RACLink
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				button({ ...renderProps, variant: props.variant, className }),
			)}
		/>
	);
}
