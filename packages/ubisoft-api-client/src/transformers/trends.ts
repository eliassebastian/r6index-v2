const parseTrends = (roles: any, roleKey: 'all' | 'attacker' | 'defender') => {
	try {
		const role = roles[roleKey];
		if (role.length === 0) return null;

		const trends = role[0];
		//@ts-ignore
		const output = {};

		const trendTypes = [
			//["winLossRatio", "Win/Loss Ratio"],
			['killDeathRatio', 'Kill/Death Ratio'],
			['headshotAccuracy', 'Headshot Accuracy'],
			['killsPerRound', 'Kills Per Round'],
			['roundsWithAKill', 'Rounds With A Kill'],
			['roundsWithMultiKill', 'Rounds With Multi Kill'],
			['roundsWithKOST', 'Rounds With KOST'],
			['roundsSurvived', 'Rounds Survived'],
		];

		for (const trend of trendTypes) {
			const key = trend[0] as string;
			const trendM = trends[key];

			const trendData = Object.keys(trendM.trend).map((key) => ({
				x: key,
				y: trendM.trend[key],
			}));

			const actualsData = Object.keys(trendM.actuals).map((key) => ({
				x: key,
				y: trendM.actuals[key],
			}));

			const trendTypeOutput = {
				id: key,
				name: trend[1],
				movingPoint: trends.movingPoints,
				high: trendM.high,
				average: trendM.average,
				low: trendM.low,
				data: [
					{
						id: 'trend',
						data: trendData,
					},
					{
						id: 'actuals',
						data: actualsData,
					},
				],
			};

			//@ts-ignore
			output[key] = trendTypeOutput;
			// output.push(trendTypeOutput);
		}

		return output;
	} catch (error) {
		return null;
	}
};

export const transform = async (data: any, id: string) => {
	try {
		const platform = data.platforms.PC ?? data.platforms.XONE;
		if (!platform) return null;

		const roles = platform.gameModes.ranked.teamRoles;
		if (!roles || Array.isArray(roles)) return null;

		return {
			all: parseTrends(roles, 'all'),
			attacker: parseTrends(roles, 'attacker'),
			defender: parseTrends(roles, 'defender'),
		};
	} catch (error) {
		console.error('An error occurred in weapons:', error);
		return null;
	}
};
