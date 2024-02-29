import type { PlayerFullTextSearch } from '@r6index/shared-types/players';
import type { FilterConfig, FilterOptions } from './types';

export const SearchFilter: FilterConfig<PlayerFullTextSearch> = {
	level: {
		label: 'Level',
		filterFunction: (item: any, searchParam: string) => {
			const filter: FilterOptions = {
				'lt=100': item.level.level < 100,
				'100_to_200': item.level.level >= 100 && item.level.level <= 200,
				'200_to_300': item.level.level >= 201 && item.level.level <= 300,
				'300_to_400': item.level.level >= 301 && item.level.level <= 400,
				'gte=400': item.kills >= 400,
			};

			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=100', label: 'Low - Below 100' },
			{ id: '100_to_200', label: 'Mid - 100 to 200' },
			{ id: '200_to_300', label: 'High - 200 to 300' },
			{ id: '300_to_400', label: 'Very High - 300 to 400' },
			{ id: 'gte=400', label: 'Very High - Above 400' },
		],
	},
	rank: {
		label: 'Rank',
		filterFunction: (item, searchParam: string) => item.ranked.rankText === searchParam,
		getOptions: (items) => {
			return Array.from(
				items
					.reduce((map, item) => {
						map.set(item.ranked.rankText, item);
						return map;
					}, new Map())
					.values(),
			).map((item) => ({
				id: item.ranked.rankText,
				label: item.ranked.rankText,
			}));
		},
	},
	lastseen: {
		label: 'Last Seen',
		filterFunction: (item, searchParam: string) => {
			// Convert last_seen_at to a Date object
			const lastSeenDate = new Date(item.lastSeenAt).getTime();
			const currentDate = Date.now();

			// Calculate the difference in days
			const diffTime = Math.abs(currentDate - lastSeenDate);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			const filter: Record<string, boolean> = {
				'lt=7': diffDays < 7,
				'7_to_30': diffDays >= 7 && diffDays <= 30,
				'31_to_90': diffDays >= 31 && diffDays <= 90,
				'gte=90': diffDays >= 90,
			};

			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=7', label: 'Less than a week' },
			{ id: '7_to_30', label: '1-4 weeks' },
			{ id: '31_to_90', label: '1-3 months' },
			{ id: 'gte=90', label: 'More than 3 months' },
		],
	},
	kd: {
		label: 'KD',
		filterFunction: (item, searchParam: string) => {
			const filter: FilterOptions = {
				'lt=1': item.ranked.kdRatio < 1,
				'1_to_1.5': item.ranked.kdRatio >= 1 && item.ranked.kdRatio < 1.5,
				'1.5_to_2': item.ranked.kdRatio >= 1.5 && item.ranked.kdRatio <= 2,
				'gte=2': item.ranked.kdRatio > 2,
			};

			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=1', label: 'Low - Below 1' },
			{ id: '1_to_1.5', label: 'Average - 1 to 1.5' },
			{ id: '1.5_to_2', label: 'High - 1.5 to 2' },
			{ id: 'gte=2', label: 'Exceptional - Above 2.0' },
		],
	},
	wl: {
		label: 'W/L',
		filterFunction: (item, searchParam: string) => {
			const filter: FilterOptions = {
				'lt=1': item.ranked.winLoseRatio < 1,
				'1_to_1.5': item.ranked.winLoseRatio >= 1 && item.ranked.winLoseRatio < 1.5,
				'1.5_to_2': item.ranked.winLoseRatio >= 1.5 && item.ranked.winLoseRatio <= 2,
				'gte=2': item.ranked.winLoseRatio > 2,
			};

			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=1', label: 'Low - Below 1' },
			{ id: '1_to_1.5', label: 'Average - 1 to 1.5' },
			{ id: '1.5_to_2', label: 'High - 1.5 to 2' },
			{ id: 'gte=2', label: 'Exceptional - Above 2.0' },
		],
	},
};
