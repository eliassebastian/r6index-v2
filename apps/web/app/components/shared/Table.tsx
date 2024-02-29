import {
	Button,
	Cell as AriaCell,
	CellProps,
	Collection,
	Column as AriaColumn,
	ColumnProps,
	ColumnResizer,
	Group,
	Row as AriaRow,
	RowProps,
	Table as AriaTable,
	TableHeader as AriaTableHeader,
	TableHeaderProps,
	TableProps,
	composeRenderProps,
	useTableOptions,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { composeTailwindRenderProps, focusRing } from './utils';

export function Table(props: TableProps) {
	return <AriaTable {...props} className='border-separate border-spacing-0' />;
}

const columnStyles = tv({
	extend: focusRing,
	base: 'px-2 h-5 flex-1 flex gap-1 items-center overflow-hidden',
});

const resizerStyles = tv({
	extend: focusRing,
	base: 'w-px px-[8px] translate-x-[8px] box-content py-1 h-5 bg-clip-content bg-gray-400 dark:bg-zinc-500 forced-colors:bg-[ButtonBorder] cursor-col-resize rounded resizing:bg-blue-600 forced-colors:resizing:bg-[Highlight] resizing:w-[2px] resizing:pl-[7px] -outline-offset-2',
});

interface ColumnPropsWithStyle extends ColumnProps {
	columnClassName?: string;
}

export function Column(props: ColumnPropsWithStyle) {
	return (
		<AriaColumn
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				'[&:hover]:z-20 [&:focus-within]:z-20 text-start text-sm text-accent-11 cursor-default',
			)}
		>
			{composeRenderProps(props.children, (children, { allowsSorting, sortDirection }) => (
				<div className='flex items-center'>
					<Group
						role='presentation'
						tabIndex={-1}
						className={composeRenderProps(props.columnClassName, (className, renderProps) =>
							columnStyles({ ...renderProps, className }),
						)}
					>
						<span className='truncate'>{children}</span>
						{allowsSorting && sortDirection && (
							<span
								className={`w-4 h-4 flex items-center justify-center transition ${
									sortDirection === 'descending' ? 'rotate-180' : ''
								}`}
							>
								{sortDirection && (
									// <ArrowUp
									//   aria-hidden
									//   className="w-4 h-4 text-gray-500 dark:text-zinc-400 forced-colors:text-[ButtonText]"
									// />
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
										<title>Arrow Up Icon</title>
										<path d='M8 10.14a20.36 20.36 0 0 0 3.702 3.893c.175.141.42.141.596 0A20.361 20.361 0 0 0 16 10.14' />
									</svg>
								)}
							</span>
						)}
					</Group>
					{!props.width && <ColumnResizer className={resizerStyles} />}
				</div>
			))}
		</AriaColumn>
	);
}

export function TableHeader<T extends object>(props: TableHeaderProps<T>) {
	const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

	return (
		<AriaTableHeader
			{...props}
			className={twMerge(
				'sticky top-0 z-10 bg-gray-100/60 dark:bg-zinc-700/60 backdrop-blur-md supports-[-moz-appearance:none]:bg-gray-100 dark:supports-[-moz-appearance:none]:bg-zinc-700 forced-colors:bg-[Canvas] rounded-t-lg border-b dark:border-b-zinc-700',
				props.className,
			)}
		>
			{/* Add extra columns for drag and drop and selection. */}
			{allowsDragging && <Column />}
			{/* {selectionBehavior === "toggle" && (
        <AriaColumn
          width={36}
          minWidth={36}
          className="text-start text-sm cursor-default p-2"
        >
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </AriaColumn>
      )} */}
			<Collection items={props.columns}>{props.children}</Collection>
		</AriaTableHeader>
	);
}

const rowStyles = tv({
	extend: focusRing,
	base: 'group/row relative cursor-default select-none -outline-offset-2 text-sm bg-accent-2',
});

export function Row<T extends object>({ id, columns, className, children, ...otherProps }: RowProps<T>) {
	const { selectionBehavior, allowsDragging } = useTableOptions();

	return (
		<AriaRow
			id={id}
			{...otherProps}
			style={{ border: '1px solid black' }}
			className={composeRenderProps(className, (className, renderProps) => rowStyles({ ...renderProps, className }))}
		>
			{allowsDragging && (
				<Cell>
					<Button slot='drag'>≡</Button>
				</Cell>
			)}
			{/* {selectionBehavior === "toggle" && (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      )} */}
			<Collection items={columns}>{children}</Collection>
		</AriaRow>
	);
}

const cellStyles = tv({
	extend: focusRing,
	base: 'p-2',
	//base: "border-b group-last/row:border-b-0 [--selected-border:theme(colors.blue.200)] dark:[--selected-border:theme(colors.blue.900)] group-selected/row:border-[--selected-border] [:has(+[data-selected])_&]:border-[--selected-border] p-2 truncate -outline-offset-2",
});

export function Cell(props: CellProps) {
	return (
		<AriaCell
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				cellStyles({ ...renderProps, className }),
			)}
		/>
	);
}
