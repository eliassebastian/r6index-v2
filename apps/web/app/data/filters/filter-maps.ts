import type { PlayerMapStat } from '@r6index/shared-types/players';
import type { FilterConfig, FilterOptions } from './types';

export const MapsFilter: FilterConfig<PlayerMapStat> = {
	side: {
		label: 'Side',
		getOptions: () => [
			{ id: 'attacker', label: 'Attacker' },
			{ id: 'defender', label: 'Defender' },
		],
	},
	name: {
		label: 'Name',
		filterFunction: (item, searchParam: string) => item.name === searchParam,
		getOptions: (items: any[]) => {
			return Array.from(new Set(items.map((item) => ({ id: item.name, label: item.name }))));
		},
	},
	kills: {
		label: 'Kills',
		filterFunction: (item: any, searchParam: string) => {
			const filter: FilterOptions = {
				'lt=40': item.kills < 40,
				'40_to_80': item.kills >= 40 && item.kills <= 80,
				'81_to_120': item.kills >= 81 && item.kills <= 120,
				'gte=120': item.kills >= 120,
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
	death: {
		label: 'Deaths',
		filterFunction: (item, searchParam) => {
			const filter: FilterOptions = {
				'lt=20': item.death < 20,
				'20_to_40': item.death >= 20 && item.death <= 40,
				'41_to_60': item.death >= 41 && item.death <= 60,
				'gte=60': item.death >= 60,
			};
			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=20', label: 'Low - Below 20' },
			{ id: '20_to_40', label: 'Mid - 20 to 40' },
			{ id: '41_to_60', label: 'High - 41 to 60' },
			{ id: 'gte=60', label: 'Very High - Above 60' },
		],
	},
	headshots: {
		label: 'Headshots',
		filterFunction: (item, searchParam) => {
			const filter: FilterOptions = {
				'lt=30': item.headshots < 30,
				'30_to_60': item.headshots >= 30 && item.headshots <= 60,
				'61_to_90': item.headshots >= 61 && item.headshots <= 90,
				'gte=90': item.headshots >= 90,
			};
			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=30', label: 'Low - Below 30' },
			{ id: '30_to_60', label: 'Mid - 30 to 60' },
			{ id: '61_to_90', label: 'High - 61 to 90' },
			{ id: 'gte=90', label: 'Very High - Above 90' },
		],
	},
	roundsWon: {
		label: 'Rounds Won',
		filterFunction: (item, searchParam) => {
			const filter: FilterOptions = {
				'lt=10': item.roundsWon < 10,
				'10_to_20': item.roundsWon >= 10 && item.roundsWon <= 20,
				'21_to_30': item.roundsWon >= 21 && item.roundsWon <= 30,
				'gte=30': item.roundsWon >= 30,
			};
			return filter[searchParam];
		},
		getOptions: () => [
			{ id: 'lt=10', label: 'Low - Below 10' },
			{ id: '10_to_20', label: 'Mid - 10 to 20' },
			{ id: '21_to_30', label: 'High - 21 to 30' },
			{ id: 'gte=30', label: 'Very High - Above 30' },
		],
	},
};

// export const newMapFilter = () => {
//   return {
//     side: {
//       id: "side",
//       filterType: "select",
//       type: "single",
//       label: "Side",
//       value: "all",
//       options: [
//         //   { id: "all", label: "All", value: "all" },
//         { id: "attacker", label: "Attacker", value: "attacker" },
//         { id: "defender", label: "Defender", value: "defender" },
//       ],
//     },
//     kills: {
//       field: "kills",
//       filterType: "range",
//       type: "single",
//       id: "kills",
//       label: "Kills",
//       options: [
//         { id: "lt=40", label: "Low - Below 40", value: { min: 0, max: 40 } },
//         {
//           id: "40_to_80",
//           label: "Mid - 40 to 80",
//           value: { min: 40, max: 80 },
//         },
//         {
//           id: "80_to_120",
//           label: "High - 80 to 120",
//           value: { min: 80, max: 120 },
//         },
//         {
//           id: "gte=120",
//           label: "Very High - Above 120",
//           value: { min: 120 },
//         },
//       ],
//     },
//     deaths: {
//       field: "deaths",
//       filterType: "range",
//       type: "single",
//       id: "deaths",
//       label: "Deaths",
//       options: [
//         { id: "lt=40", label: "Low - Below 40", value: { min: 0, max: 40 } },
//         {
//           id: "40_to_80",
//           label: "Mid - 40 to 80",
//           value: { min: 40, max: 80 },
//         },
//         {
//           id: "80_to_120",
//           label: "High - 80 to 120",
//           value: { min: 80, max: 120 },
//         },
//         {
//           id: "gte=120",
//           label: "Very High - Above 120",
//           value: { min: 120 },
//         },
//       ],
//     },
//     headshots: {
//       field: "headshots",
//       filterType: "range",
//       type: "single",
//       id: "headshots",
//       label: "Headshots",
//       options: [
//         { id: "lt=40", label: "Low - Below 40", value: { min: 0, max: 40 } },
//         {
//           id: "40_to_80",
//           label: "Mid - 40 to 80",
//           value: { min: 40, max: 80 },
//         },
//         {
//           id: "80_to_120",
//           label: "High - 80 to 120",
//           value: { min: 80, max: 120 },
//         },
//         {
//           id: "gte=120",
//           label: "Very High - Above 120",
//           value: { min: 120 },
//         },
//       ],
//     },
//     accuracy: {
//       field: "headshotAccuracy",
//       filterType: "range",
//       type: "single",
//       id: "accuracy",
//       label: "Accuracy",
//       options: [
//         {
//           id: "lt=0.1",
//           label: "Low - Below 10%",
//           value: { min: 0, max: 0.1 },
//         },
//         {
//           id: "0.1_to_0.4",
//           label: "Mid - 10% to 40%",
//           value: { min: 0.1, max: 0.4 },
//         },
//         { id: "gte=0.4", label: "High - Above 40%", value: { min: 0.4 } },
//       ],
//     },
//     type: {
//       field: "name",
//       filterType: "unique",
//       type: "multiple",
//       id: "name",
//       label: "Name",
//       options: [],
//     },
//   };
// };
