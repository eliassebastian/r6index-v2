import type { PlayerFullTextSearch } from '@r6index/shared-types/players';
import { useCallback, useState } from 'react';
import { GridList, GridListItem } from 'react-aria-components';
import { SearchFilter } from '~/data/filters/filter-search';
import { usePlayerFilter } from '~/hooks/player/use-player-filter';
import { Filter as Filterbox } from '../filter/filter-box';
import { Filter, FilterGroup } from '../filter/filter-group';
import { Button } from '../shared/Button';
import { SearchIndexAction } from './search-index-action';
import { SearchResultEmptyState } from './search-results-empty-state';
import { SearchResultItem } from './search-results-item';

interface Props {
	data: PlayerFullTextSearch[] | null;
}

export const SearchResults = ({ data }: Props) => {
	const { availableFilters, filteredData, activeFilters, setFilter } = usePlayerFilter(data, SearchFilter);
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
			if (isHome && inputElement && inputElement.value === '' && event.key === 'Backspace') {
				setIsOpen(false);
			}

			if (isHome || !inputElement || inputElement.value !== '') {
				return;
			}

			if (event.key === 'Backspace') {
				event.preventDefault();
				popPage();
			}

			if (event.key === 'Enter') {
				inputElement.value = '';
			}
		},
		[isHome, popPage],
	);

	if (!data || data?.length === 0) {
		return (
			<>
				<SearchIndexAction showImage />
				<SearchResultEmptyState.Container showRippleEffect>
					<SearchResultEmptyState.Icon>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							width='24'
							height='24'
							fill='none'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							className='text-accent-11'
						>
							<title>Icon</title>
							<path d='m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z' />
						</svg>
					</SearchResultEmptyState.Icon>
					<SearchResultEmptyState.Title>No Players found</SearchResultEmptyState.Title>
					<SearchResultEmptyState.Description>
						Your search did not match any indexed players in our database.
					</SearchResultEmptyState.Description>
					<SearchResultEmptyState.Action>
						<Button
							onPress={() => {
								document.getElementById('search')?.focus();
							}}
						>
							New Search
						</Button>
					</SearchResultEmptyState.Action>
				</SearchResultEmptyState.Container>
			</>
		);
	}

	return (
		<>
			<div className='hidden lg:flex items-center gap-4 w-full sticky z-10 top-[200px] bg-accent-1 py-4'>
				<h1 className='text-accent-12'>I am looking for</h1>
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
												<Filter
													id={filter.id}
													key={filter.id}
													onRemove={() => {
														setFilter?.(key, filter.id);
													}}
												>
													{filter.label}
												</Filter>
											);
										})}
									</FilterGroup>
								);
							})}
						<div className='relative flex gap-1'>
							<Filterbox.Root open={isOpen} onOpenChange={setIsOpen}>
								<Filterbox.Trigger />
								<Filterbox.Content
									pages={pages}
									className={'p-0 rounded-none border-none overflow-hidden'}
									side='bottom'
									sideOffset={-32}
									align='start'
									// @ts-ignore
									onKeyDown={onKeyDown}
								>
									{isHome && (
										<>
											{Object.keys(SearchFilter).map((key) => {
												return (
													<Filterbox.Item
														key={key}
														value={key}
														onSelect={() => {
															setPages((pages) => [...pages, key]);
														}}
													>
														{SearchFilter[key].label}
													</Filterbox.Item>
												);
											})}
										</>
									)}
									{!isHome && (
										<>
											{availableFilters![activePage].options.map((filter) => {
												return (
													<Filterbox.Item
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
													</Filterbox.Item>
												);
											})}
										</>
									)}
								</Filterbox.Content>
							</Filterbox.Root>
						</div>
					</div>
				</div>
			</div>
			<GridList
				aria-label='Search Results List'
				className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 z-0 gap-y-4 md:gap-4'}
				// items={filteredData}
				selectionMode='none'
				key={'profile_id'}
			>
				<GridListItem textValue='r6index:search-new' className={'col-span-2 h-full'}>
					<SearchIndexAction
						className='!p-3 !my-0 md:h-full md:!pl-[100px] lg:!pl-[110px] md:!py-3 md:!pr-4 md:min-h-[98px]'
						showImage
					/>
				</GridListItem>
				{filteredData?.map((player: PlayerFullTextSearch) => (
					<SearchResultItem key={player.id} player={player} />
				))}
			</GridList>
		</>
	);
};
