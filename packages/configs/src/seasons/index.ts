type Season = {
	name: string;
	hex: string;
	code: string;
	date: string;
};

export const UbisoftSeasonsConfig: Record<number, Season> = {
	32: {
		name: 'Deep Freeze',
		hex: '#55a1aa',
		code: 'Y8S4',
		date: '20231206',
	},
};
