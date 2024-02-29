import {
	Label,
	Tag as AriaTag,
	TagGroup as AriaTagGroup,
	TagGroupProps as AriaTagGroupProps,
	TagList,
	TagListProps,
	TagProps as AriaTagProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { Button } from '../shared/Button';

export interface FilterGroupProps<T>
	extends Omit<AriaTagGroupProps, 'children'>,
		Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
	label?: string;
	description?: string;
	errorMessage?: string;
}

export function FilterGroup<T extends object>({
	label,
	description,
	errorMessage,
	items,
	children,
	renderEmptyState,
	...props
}: FilterGroupProps<T>) {
	return (
		<AriaTagGroup {...props} className={twMerge('flex flex-nowrap gap-0.5', props.className)}>
			<Label className='rounded-l-lg bg-accent-3 border-[0.5px] border-accent-7 text-accent-11 flex items-center text-center px-2.5 py-1.5 h-8 text-sm'>
				{label}
			</Label>
			<TagList items={items} renderEmptyState={renderEmptyState} className='flex flex-wrap gap-0.5'>
				{children}
			</TagList>
		</AriaTagGroup>
	);
}

interface FilterProps extends AriaTagProps {
	onRemove?: () => void;
}

export function Filter({ children, onRemove, ...props }: FilterProps) {
	const textValue = typeof children === 'string' ? children : undefined;
	return (
		<AriaTag
			textValue={textValue}
			{...props}
			className={
				'bg-accent-3 border-[0.5px] border-accent-7 text-accent-12 flex items-center gap-1 text-sm h-8 pl-3 pr-2 last:rounded-r-lg outline-0 focus-visible:outline-2 outline outline-blue-600 dark:outline-blue-500 outline-offset-2'
			}
		>
			<>
				{children}
				<Button
					slot='remove'
					variant='ghost'
					className={
						'size-5 p-0 flex justify-center items-center text-accent-11 hover:text-accent-12 hover:bg-transparent'
					}
					onPress={onRemove}
				>
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
						<title>Filter</title>
						<path d='m6 18 6-6m0 0 6-6m-6 6L6 6m6 6 6 6' />
					</svg>
				</Button>
			</>
		</AriaTag>
	);
}
