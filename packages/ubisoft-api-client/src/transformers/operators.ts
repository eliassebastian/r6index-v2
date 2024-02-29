import { calculateRatio } from '../utils';

export const transform = (data: any, id: string) => {
	try {
		const platform = data.platforms.PC ?? data.platforms.XONE;
		if (!platform) return null;

		const operatorSides = platform.gameModes.ranked.teamRoles;
		if (!operatorSides) return null;

		// remove operators with no class (ubisoft status bug)
		const attackersSanitised = operatorSides.Attacker.filter((o: any) => o.statsDetail !== 'No Class');
		const defendersSanitised = operatorSides.Defender.filter((o: any) => o.statsDetail !== 'No Class');

		const operators = [
			...attackersSanitised.map((o: any) => ({
				operatorSide: 'attacker',
				name: o.statsDetail,
				matchesPlayed: o.matchesPlayed,
				roundsPlayed: o.roundsPlayed,
				minutesPlayed: o.minutesPlayed,
				matchesWon: o.matchesWon,
				matchesLost: o.matchesLost,
				roundsWon: o.roundsWon,
				roundsLost: o.roundsLost,
				kills: o.kills,
				death: o.death,
				headshots: o.headshots,
				winLossRatio: calculateRatio(o.roundsWon, o.roundsLost),
				killDeathRatio: o.killDeathRatio.value,
				headshotAccuracy: o.headshotAccuracy.value,
				killsPerRound: o.killsPerRound.value,
				roundsWithAKill: o.roundsWithAKill.value,
				roundsWithMultiKill: o.roundsWithMultiKill.value,
				roundsWithOpeningKill: o.roundsWithOpeningKill.value,
				roundsWithOpeningDeath: o.roundsWithOpeningDeath.value,
				roundsWithKOST: o.roundsWithKOST.value,
				roundsSurvived: o.roundsSurvived.value,
				roundsWithAnAce: o.roundsWithAnAce.value,
				roundsWithClutch: o.roundsWithClutch.value,
			})),
			...defendersSanitised.map((o: any) => ({
				operatorSide: 'defender',
				name: o.statsDetail,
				matchesPlayed: o.matchesPlayed,
				roundsPlayed: o.roundsPlayed,
				minutesPlayed: o.minutesPlayed,
				matchesWon: o.matchesWon,
				matchesLost: o.matchesLost,
				roundsWon: o.roundsWon,
				roundsLost: o.roundsLost,
				kills: o.kills,
				death: o.death,
				headshots: o.headshots,
				winLossRatio: calculateRatio(o.roundsWon, o.roundsLost),
				killDeathRatio: o.killDeathRatio.value,
				headshotAccuracy: o.headshotAccuracy.value,
				killsPerRound: o.killsPerRound.value,
				roundsWithAKill: o.roundsWithAKill.value,
				roundsWithMultiKill: o.roundsWithMultiKill.value,
				roundsWithOpeningKill: o.roundsWithOpeningKill.value,
				roundsWithOpeningDeath: o.roundsWithOpeningDeath.value,
				roundsWithKOST: o.roundsWithKOST.value,
				roundsSurvived: o.roundsSurvived.value,
				roundsWithAnAce: o.roundsWithAnAce.value,
				roundsWithClutch: o.roundsWithClutch.value,
			})),
		];

		if (operators.length === 0) return null;
		return operators;
	} catch (error) {
		console.error('An error occurred in maps:', error);
		return null;
	}
};
