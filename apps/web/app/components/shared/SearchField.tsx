import {
	SearchField as AriaSearchField,
	SearchFieldProps as AriaSearchFieldProps,
	ValidationResult,
} from 'react-aria-components';
import { Button } from './Button';
import { Description, FieldError, FieldGroup, Input, Label } from './Field';
import { composeTailwindRenderProps } from './utils';

export interface SearchFieldProps extends AriaSearchFieldProps {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
}

export function SearchField({ label, description, errorMessage, ...props }: SearchFieldProps) {
	return (
		<AriaSearchField
			{...props}
			className={composeTailwindRenderProps(props.className, 'group flex flex-col gap-1 min-w-[40px]')}
		>
			{label && <Label>{label}</Label>}
			<FieldGroup>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					width='14'
					height='14'
					fill='none'
					stroke='currentColor'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
				>
					<title>Search Icon</title>
					<path d='m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z' />
				</svg>
				<Input className='[&::-webkit-search-cancel-button]:hidden bg-transparent' />
				<Button variant='icon' className='mr-1 w-6 group-empty:invisible'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						width='14'
						height='14'
						fill='none'
						stroke='currentColor'
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
					>
						<title>Clear Icon</title>
						<path d='m6 18 6-6m0 0 6-6m-6 6L6 6m6 6 6 6' />
					</svg>
				</Button>
			</FieldGroup>
			{description && <Description>{description}</Description>}
			<FieldError>{errorMessage}</FieldError>
		</AriaSearchField>
	);
}
