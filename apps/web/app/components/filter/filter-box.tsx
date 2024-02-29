import * as Popover from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { forwardRef, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Command, CommandEmpty, CommandInput, CommandList } from '../shared/Command';

const Root = Popover.Root;
const Trigger = () => {
	return (
		<Popover.Trigger className='size-8 flex items-center justify-center text-sm text-center transition rounded-lg cursor-default bg-accent-3 hover:bg-accent-4 border-[0.5px] border-accent-7 pressed:bg-accent-5 hover:border-accent-8 text-accent-12 outline outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight] outline-offset-2 outline-0 focus-visible:outline-2'>
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
				<title>Filter trigger Icon</title>
				<path d='M12 19v-7m0 0V5m0 7H5m7 0h7' />
			</svg>
		</Popover.Trigger>
	);
};

const Content = forwardRef<
	React.ElementRef<typeof Popover.Content>,
	React.ComponentPropsWithoutRef<typeof Popover.Content> & {
		pages: string[];
		onKeyDown?: (event: React.KeyboardEvent, inputElement: HTMLInputElement | null) => void;
	}
>(({ children, className, onKeyDown, pages, align = 'center', sideOffset = 4, ...props }, ref) => {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<Popover.Content
			ref={ref}
			align={align}
			sideOffset={sideOffset}
			className={twMerge(
				'bg-accent-3 border-[0.5px] border-accent-7 rounded-lg z-50 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 [--radix-popper-transform-origin:50%_0px]',
				className,
			)}
			{...props}
		>
			<Command
				onKeyDown={(event) => {
					onKeyDown?.(event, inputRef.current);
				}}
				className='bg-accent-3 border-[0.5px] border-accent-7 rounded-lg'
			>
				{pages.length > 1 && (
					<div className='flex gap-1 p-1'>
						{pages.slice(1).map((page) => (
							<div
								key={page}
								className='uppercase text-xs bg-accent-2 text-accent-11 px-2 py-1 rounded-[calc(0.5rem-0.25rem)]'
							>
								{page}
							</div>
						))}
					</div>
				)}
				<CommandInput ref={inputRef} className='text-accent-12' />
				<CommandList className='p-1'>
					<CommandEmpty className='h-8 text-xs flex items-center justify-center text-center'>
						No filter found.
					</CommandEmpty>
					{children}
				</CommandList>
			</Command>
		</Popover.Content>
	);
});

Content.displayName = Popover.Content.displayName;

const Item = forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={twMerge(
			'relative flex cursor-default select-none items-center rounded-[calc(0.5rem-0.25rem)] px-2 py-1.5 text-sm outline-none aria-selected:bg-accent-4 text-accent-11 aria-selected:text-accent-12 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		{...props}
	/>
));

Item.displayName = CommandPrimitive.Item.displayName;

export const Filter = {
	Root,
	Trigger,
	Content,
	Item,
};
