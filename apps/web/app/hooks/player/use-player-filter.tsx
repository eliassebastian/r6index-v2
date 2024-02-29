import { useSearchParams } from '@remix-run/react';
import { useCallback, useMemo } from 'react';
import { Filter, FilterConfig } from '~/data/filters/types';

type Filters = Record<string, Filter>;

export function usePlayerFilter<T>(
	data: { [key: string]: T[] } | T[] | undefined,
	config: FilterConfig<T>,
	useSide?: boolean,
) {
	// use url search params as source of truth
	const [searchParams, setSearchParams] = useSearchParams();
	const side = searchParams.get('side') ?? 'all';
	const dataBySide = useMemo(() => {
		if (!useSide) return data as T[];
		return (data as { [key: string]: T[] })[side];
	}, [side, data, useSide]);

	// active filters based on search params
	const activeFilters = useMemo(
		() =>
			Array.from(searchParams.keys()).reduce((acc, key) => {
				// check if filter exists
				if (!config[key]) return acc;

				// get values from search params
				const selectedValues = searchParams.get(key)!.split(',');

				// construct the filter info with only the selected options
				const selectedOptions = config[key]
					.getOptions(dataBySide)
					.filter((option) => selectedValues.includes(option.id));

				if (selectedOptions.length > 0) {
					acc[key] = { label: config[key].label, options: selectedOptions };
				}

				return acc;
			}, {} as Filters),
		[searchParams, dataBySide],
	);

	const availableFilters = useMemo(
		() =>
			Object.entries(config).reduce((acc, [key, filter]) => {
				const options = filter.getOptions(dataBySide);
				// Check if the filter is currently applied
				if (activeFilters[key]) {
					// Exclude the options that are already applied
					const availableOptions = options.filter(
						(option) => !activeFilters[key].options.some((currentOption) => currentOption.id === option.id),
					);
					// If there are available options left after excluding the applied ones
					if (availableOptions.length > 0) {
						acc[key] = { label: filter.label, options: availableOptions };
					}
				} else {
					// If the filter is not applied, include all options
					acc[key] = { label: filter.label, options };
				}

				return acc;
			}, {} as Filters),
		[],
	);

	const filteredData = useMemo(() => {
		return dataBySide.filter((item) => {
			return Object.entries(activeFilters).every(([activeFilterId, activeFilter]) => {
				// skip filters without a filter function
				if (config[activeFilterId].filterFunction === undefined) {
					return true;
				}

				return activeFilter.options.some((param) => config[activeFilterId].filterFunction!(item, param.id));
			});
		});
	}, [dataBySide, activeFilters]);

	const setFilter = useCallback(
		(filterId: string, optionId: string) => {
			setSearchParams(
				(prevParams) => {
					// Retrieve the filter configuration
					const filterConfig = config[filterId];
					if (!filterConfig) return prevParams;

					// check if filters can stack
					if (filterConfig.isMulti) {
						const existingValues = prevParams.get(filterId) ? prevParams.get(filterId)!.split(',') : [];
						if (existingValues.includes(optionId)) {
							prevParams.set(filterId, existingValues.filter((val) => val !== optionId).join(','));
						} else {
							existingValues.push(optionId);
							prevParams.set(filterId, existingValues.join(','));
						}
					} else {
						if (prevParams.get(filterId) === optionId) {
							prevParams.delete(filterId);
						} else {
							prevParams.set(filterId, optionId);
						}
					}

					// Remove the filter from params if it is empty
					if (!prevParams.get(filterId)) {
						prevParams.delete(filterId);
					}

					return prevParams;
				},
				{ preventScrollReset: true },
			);
		},
		[config],
	);

	if (!data) {
		return {
			availableFilters: {} as Filters,
			activeFilters: {} as Filters,
			filteredData: [] as T[],
		};
	}

	return {
		availableFilters,
		activeFilters,
		filteredData,
		setFilter,
	};
}
