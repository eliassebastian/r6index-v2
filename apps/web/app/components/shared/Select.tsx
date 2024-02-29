import React from 'react';
import {
	Button,
	ListBox,
	ListBoxItemProps,
	Select as AriaSelect,
	SelectProps as AriaSelectProps,
	SelectValue,
	ValidationResult,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { Description, FieldError, Label } from './Field';
import { DropdownItem, DropdownSection, DropdownSectionProps } from './Listbox';
import { Popover } from './Popover';
import { composeTailwindRenderProps, focusRing } from './utils';

const styles = tv({
	extend: focusRing,
	base: 'flex items-center text-sm text-start gap-4 w-full cursor-default rounded-lg pl-3 pr-2 py-2 min-w-[150px] transition bg-accent-3 hover:bg-accent-4 border-[0.5px] border-accent-7 pressed:bg-accent-5 hover:border-accent-8 text-accent-12',
	variants: {
		isDisabled: {
			false: '',
			true: 'text-gray-200 dark:text-zinc-600 forced-colors:text-[GrayText] dark:bg-zinc-800 dark:border-white/5 forced-colors:border-[GrayText]',
		},
	},
});

export interface SelectProps<T extends object> extends Omit<AriaSelectProps<T>, 'children'> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	items?: Iterable<T>;
	children: React.ReactNode | ((item: T) => React.ReactNode);
	placement?: 'bottom' | 'top';
}

export function Select<T extends object>({
	label,
	description,
	errorMessage,
	children,
	items,
	placement,
	...props
}: SelectProps<T>) {
	return (
		<AriaSelect {...props} className={composeTailwindRenderProps(props.className, 'group flex flex-col gap-1')}>
			{label && <Label>{label}</Label>}
			<Button className={styles}>
				<SelectValue className='flex-1 text-sm' />
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					width='16'
					height='16'
					fill='none'
					stroke='currentColor'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
				>
					<title>Dropdown Icon</title>
					<path d='M8 10.14a20.36 20.36 0 0 0 3.702 3.893c.175.141.42.141.596 0A20.361 20.361 0 0 0 16 10.14' />
				</svg>
				{/* <ChevronDown
          aria-hidden
          className="w-4 h-4 text-gray-600 dark:text-zinc-400 forced-colors:text-[ButtonText] group-disabled:text-gray-200 dark:group-disabled:text-zinc-600 forced-colors:group-disabled:text-[GrayText]"
        /> */}
			</Button>
			{description && <Description>{description}</Description>}
			<FieldError>{errorMessage}</FieldError>
			<Popover className='min-w-[--trigger-width]'>
				<ListBox
					items={items}
					className='outline-none p-1 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]'
				>
					{children}
				</ListBox>
			</Popover>
		</AriaSelect>
	);
}

export function SelectItem(props: ListBoxItemProps) {
	return <DropdownItem {...props} />;
}

export function SelectSection<T extends object>(props: DropdownSectionProps<T>) {
	return <DropdownSection {...props} />;
}
