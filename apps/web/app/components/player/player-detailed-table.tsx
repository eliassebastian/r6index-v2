import { KeyboardEvent, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { ResizableTableContainer, type SortDescriptor } from 'react-aria-components';
import type { FilterConfig } from '~/data/filters/types';
import { usePlayerFilter } from '~/hooks/player/use-player-filter';
import { Filter as FilterBox } from '../filter/filter-box';
import { Filter as SharedFilter, FilterGroup } from '../filter/filter-group';
import { Table as SharedTable } from '../shared/Table';

interface ContainerProps {
	children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
	return <div className='min-h-dvh w-full max-w-6xl mx-auto px-4 py-4 lg:py-16'>{children}</div>;
};

interface FilterProps<T> {
	title: string;
	config: FilterConfig<T>;
	data: any;
	useSide?: boolean;
	children: (data: T[]) => ReactNode;
}

const Filter = <T,>({ title, config, data, useSide, children }: FilterProps<T>) => {
	const { availableFilters, filteredData, activeFilters, setFilter } = usePlayerFilter(data, config, useSide);

	const [isOpen, setIsOpen] = useState(false);
	const [pages, setPages] = useState<string[]>(['filter']);
	const activePage = pages[pages.length - 1];
	const isHome = activePage === 'filter';

	const popPage = useCallback(() => {
		setPages((pages) => {
			const x = [...pages];
			x.splice(-1, 1);
			return x;
		});
	}, []);

	const onKeyDown = useCallback(
		(event: KeyboardEvent, inputElement: HTMLInputElement | null) => {
			// close filter box with backspace key event if at home and input is empty
			if (isHome && inputElement && inputElement.value === '' && event.key === 'Backspace') {
				setIsOpen(false);
			}

			// prevent key events if already at home or input is not empty
			if (isHome || !inputElement || inputElement.value !== '') {
				return;
			}

			// go back a page if backspace is pressed
			if (event.key === 'Backspace') {
				event.preventDefault();
				popPage();
			}

			// clear input
			if (event.key === 'Enter') {
				inputElement.value = '';
			}
		},
		[isHome, popPage],
	);

	return (
		<div>
			<div className='flex items-center gap-4 w-full'>
				<h1 className='text-xl text-accent-12'>{title}</h1>
				<div className='grow'>
					<div className='flex flex-wrap w-full gap-2'>
						{activeFilters &&
							Object.keys(activeFilters).map((key) => {
								return (
									<FilterGroup
										id={key}
										key={key}
										label={activeFilters[key].label}
										selectionMode='single'
										onSelectionChange={(selection) => {
											const selected = [...selection];
											setFilter?.(key, selected[0] as string);
										}}
									>
										{activeFilters[key].options.map((filter) => {
											return (
												<SharedFilter
													id={filter.id}
													key={filter.id}
													onRemove={() => {
														setFilter?.(key, filter.id);
													}}
												>
													{filter.label}
												</SharedFilter>
											);
										})}
									</FilterGroup>
								);
							})}
						<div className='relative flex gap-1'>
							<FilterBox.Root open={isOpen} onOpenChange={setIsOpen}>
								<FilterBox.Trigger />
								<FilterBox.Content
									pages={pages}
									className={'p-0 rounded-none border-none overflow-hidden'}
									side='top'
									sideOffset={-32}
									align='start'
									// @ts-ignore
									onKeyDown={onKeyDown}
								>
									{isHome && (
										<>
											{Object.keys(config).map((key) => {
												return (
													<FilterBox.Item
														key={key}
														value={key}
														onSelect={() => {
															setPages((pages) => [...pages, key]);
														}}
													>
														{config[key].label}
													</FilterBox.Item>
												);
											})}
										</>
									)}
									{!isHome && (
										<>
											{availableFilters![activePage].options.map((filter) => {
												return (
													<FilterBox.Item
														key={filter.id}
														value={filter.id}
														onSelect={() => {
															setFilter?.(activePage, filter.id);
															popPage();
															setIsOpen(false);
															setTimeout(() => {
																setIsOpen(true);
															}, 150);
														}}
													>
														{filter.label}
													</FilterBox.Item>
												);
											})}
										</>
									)}
								</FilterBox.Content>
							</FilterBox.Root>
						</div>
					</div>
				</div>
				<div className='flex'>
					{/* <Button className={"size-8 flex justify-center items-center p-0"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="16"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <path
                    d="M16.5 15L13.5 12M13.5 12L10.5 9M13.5 12L16.5 9M13.5 12L10.5 15M7.12512 6.02049C5.49716 7.59456 4.01576 9.36639 2.70601 11.3066C2.56867 11.5101 2.5 11.755 2.5 12C2.5 12.245 2.56867 12.4899 2.70601 12.6934C4.01576 14.6336 5.49716 16.4054 7.12512 17.9795C7.48295 18.3255 7.66186 18.4985 7.91047 18.6468C8.11699 18.7701 8.38604 18.8789 8.62018 18.9338C8.90202 19 9.18097 19 9.73887 19H17.5C18.9001 19 19.6002 19 20.135 18.7275C20.6054 18.4878 20.9878 18.1054 21.2275 17.635C21.5 17.1002 21.5 16.4001 21.5 15V9C21.5 7.59987 21.5 6.8998 21.2275 6.36502C20.9878 5.89462 20.6054 5.51217 20.135 5.27248C19.6002 5 18.9001 5 17.5 5H9.73887C9.18097 5 8.90202 5 8.62018 5.06616C8.38604 5.12112 8.11699 5.22993 7.91047 5.35316C7.66186 5.50151 7.48294 5.6745 7.12512 6.02049Z"
                    stroke="currentcolor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button> */}
				</div>
			</div>
			{children(filteredData)}
		</div>
	);
};

interface TableProps<T> {
	data: T[];
	label: string;
	children: (data: T[]) => ReactNode;
	defaultSortColumn?: string;
}

const Table = <T,>({ data, label, children, defaultSortColumn = '' }: TableProps<T>) => {
	const filterClickRef = useRef<{
		counter: number;
		descriptor: SortDescriptor;
	}>({ counter: 0, descriptor: { column: '', direction: 'ascending' } });

	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: '',
		direction: 'ascending',
	});

	const items = useMemo(() => {
		// Early return for empty or undefined data
		if (!data || data.length === 0) {
			return [];
		}

		console.log('data change');

		// Default sort column
		const sortColumn = sortDescriptor.column || defaultSortColumn;

		return data.slice().sort((a, b) => {
			// Extract values for comparison
			// @ts-ignore
			const aValue = a[sortColumn];
			// @ts-ignore
			const bValue = b[sortColumn];

			// Determine sort order multiplier
			const sortOrder = sortDescriptor.direction === 'descending' ? -1 : 1;

			// Check if both values are numbers
			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return (aValue - bValue) * sortOrder;
			}

			// If one or both values are not numbers, convert to string and use localeCompare
			return (
				String(aValue).localeCompare(String(bValue), undefined, {
					numeric: true,
				}) * sortOrder
			);
		});
	}, [sortDescriptor, data]);

	return (
		<ResizableTableContainer className='w-full overflow-auto mt-10 scroll-pt-[2.321rem] rounded-lg'>
			<SharedTable
				aria-label={label}
				selectionMode='single'
				sortDescriptor={sortDescriptor}
				onSortChange={(sortDescriptor) => {
					// Increment the counter for each click
					if (filterClickRef.current.descriptor.column === sortDescriptor.column) {
						filterClickRef.current.counter++;
					} else {
						// Reset the counter if the column has changed
						filterClickRef.current.counter = 1;
						filterClickRef.current.descriptor = sortDescriptor;
					}

					// Reset sort descriptor if counter is 3 for the same column
					if (filterClickRef.current.counter === 3) {
						setSortDescriptor({ column: '', direction: 'ascending' });
						filterClickRef.current.counter = 0;
						filterClickRef.current.descriptor = {
							column: '',
							direction: 'ascending',
						};
						return;
					}

					setSortDescriptor(sortDescriptor);
				}}
			>
				{children(items)}
			</SharedTable>
		</ResizableTableContainer>
	);
};

export const PlayerDetailedPage = {
	Container,
	Filter,
	Table,
};
