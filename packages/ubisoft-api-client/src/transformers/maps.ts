import { calculateRatio } from '../utils';

const parseMaps = (teamRoles: any, roleKey: 'all' | 'attacker' | 'defender') => {
	try {
		const maps = teamRoles[roleKey];
		if (!maps || maps.length === 0) return null;

		return maps.map((m: any) => ({
			name: m.statsDetail,
			matchesPlayed: m.matchesPlayed,
			roundsPlayed: m.roundsPlayed,
			minutesPlayed: m.minutesPlayed,
			matchesWon: m.matchesWon,
			matchesLost: m.matchesLost,
			roundsWon: m.roundsWon,
			roundsLost: m.roundsLost,
			kills: m.kills,
			death: m.death,
			headshots: m.headshots,
			killDeathRatio: m.killDeathRatio.value,
			winLossRatio: calculateRatio(m.roundsWon, m.roundsLost),
			headshotAccuracy: m.headshotAccuracy.value,
			killsPerRound: m.killsPerRound.value,
			roundsWithAKill: m.roundsWithAKill.value,
			roundsWithMultiKill: m.roundsWithMultiKill.value,
			roundsWithOpeningKill: m.roundsWithOpeningKill.value,
			roundsWithOpeningDeath: m.roundsWithOpeningDeath.value,
			roundsWithKOST: m.roundsWithKOST.value,
			roundsSurvived: m.roundsSurvived.value,
			roundsWithAnAce: m.roundsWithAnAce.value,
			roundsWithClutch: m.roundsWithClutch.value,
		}));
	} catch (error) {
		console.error('An error occurred in role:', roleKey, error);
		return null;
	}
};

export const transform = (data: any, id: string) => {
	try {
		const platform = data.platforms.PC ?? data.platforms.XONE;
		if (!platform) return null;

		const maps = platform.gameModes.ranked.teamRoles;

		return {
			all: parseMaps(maps, 'all'),
			attacker: parseMaps(maps, 'attacker'),
			defender: parseMaps(maps, 'defender'),
		};
	} catch (error) {
		console.error('An error occurred in maps:', error);
		return null;
	}
};
