export const calculateBestOperator = (operators: any) => {
	if (!operators || !operators.length) return undefined;

	return operators.reduce(
		(bestOperator: any, currentStats) => {
			const currentScore =
				currentStats.roundsPlayed * 0.3 +
				currentStats.roundsWithKOST * 100 * 0.3 +
				currentStats.killDeathRatio * 0.1 +
				currentStats.winLossRatio * 0.1;

			if (!bestOperator || currentScore > bestOperator.score) {
				return { ...currentStats, score: currentScore };
			}

			return bestOperator;
		},
		{ ...operators[0], score: -Infinity },
	);
};
