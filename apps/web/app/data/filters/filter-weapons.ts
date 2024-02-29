import type { PlayerWeaponStat } from '@r6index/shared-types/players';
import type { FilterConfig, FilterOptions } from './types';

export const WeaponFilter: FilterConfig<PlayerWeaponStat> = {
	side: {
		label: 'Side',
		getOptions: () => [
			{ id: 'attacker', label: 'Attacker' },
			{ id: 'defender', label: 'Defender' },
		],
	},
	kills: {
		label: 'Kills',
		filterFunction: (item, searchParam: string) => {
			const filter: FilterOptions = {
				'lt=40': item.kills < 40,
				'40_to_80': item.kills >= 40 && item.kills <= 80,
				'81_to_120': item.kills >= 81 && item.kills <= 120,
				'gte=120': item.kills > 120,
			};

			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=40', label: 'Low - Below 40' },
			{ id: '40_to_80', label: 'Mid - 40 to 80' },
			{ id: '81_to_120', label: 'High - 81 to 120' },
			{ id: 'gte=120', label: 'Very High - Above 120' },
		],
	},
	headshots: {
		label: 'Headshots',
		filterFunction: (item, searchParam: string) => {
			const filter: FilterOptions = {
				'lt=40': item.headshots < 40,
				'40_to_80': item.headshots >= 40 && item.headshots <= 80,
				'81_to_120': item.headshots >= 81 && item.headshots <= 120,
				'gte=120': item.headshots > 120,
			};

			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=40', label: 'Low - Below 40' },
			{ id: '40_to_80', label: 'Mid - 40 to 80' },
			{ id: '81_to_120', label: 'High - 81 to 120' },
			{ id: 'gte=120', label: 'Very High - Above 120' },
		],
	},
	accuracy: {
		label: 'Accuracy',
		filterFunction: (item, searchParam) => {
			const filter: FilterOptions = {
				'lt=0.1': item.headshotAccuracy < 0.1,
				'0.1_to_0.4': item.headshotAccuracy >= 0.1 && item.headshotAccuracy <= 0.4,
				'gte=0.4': item.headshotAccuracy > 0.4,
			};

			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=0.1', label: 'Low - Below 10%' },
			{ id: '0.1_to_0.4', label: 'Mid - 10% to 40%' },
			{ id: 'gte=0.4', label: 'High - Above 40%' },
		],
	},
	weapon: {
		label: 'Weapon',
		filterFunction: (item, searchParam: string) => item.weaponName === searchParam,
		getOptions: (items) => {
			return Array.from(
				items
					.reduce((map, item) => {
						map.set(item.weaponName, item);
						return map;
					}, new Map())
					.values(),
			).map((item) => ({ id: item.weaponName, label: item.weaponName }));
		},
	},
	class: {
		label: 'Weapon Class',
		filterFunction: (item, searchParam: string) => item.weaponType === searchParam,
		getOptions: (items) => {
			return Array.from(
				items
					.reduce((map, item) => {
						map.set(item.weaponType, item);
						return map;
					}, new Map())
					.values(),
			).map((item) => ({ id: item.weaponType, label: item.weaponType }));
		},
	},
};
