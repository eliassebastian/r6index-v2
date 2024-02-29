const parseSummary = (roles: any, roleKey: 'all' | 'attacker' | 'defender') => {
	try {
		const role = roles[roleKey];
		if (!role || !role.length) return null;

		return {
			statsDetail: role[0].statsDetail,
			minutesPlayed: role[0].minutesPlayed,
			headshotAccuracy: role[0].headshotAccuracy.value,
			killsPerRound: role[0].killsPerRound.value,
			roundsWithAKill: role[0].roundsWithAKill.value,
			roundsWithMultiKill: role[0].roundsWithMultiKill.value,
			roundsWithOpeningKill: role[0].roundsWithOpeningKill.value,
			roundsWithOpeningDeath: role[0].roundsWithOpeningDeath.value,
			roundsWithKOST: role[0].roundsWithKOST.value,
			roundsSurvived: role[0].roundsSurvived.value,
			roundsWithAnAce: role[0].roundsWithAnAce.value,
			roundsWithClutch: role[0].roundsWithClutch.value,
		};
	} catch (error) {
		return null;
	}
};

export const transform = (data: any, id: string) => {
	try {
		const platform = data.platforms.PC ?? data.platforms.XONE;
		if (!platform) return null;

		const roles = platform.gameModes.ranked.teamRoles;
		if (!roles || Array.isArray(roles)) return null;

		return {
			all: parseSummary(roles, 'all'),
			attacker: parseSummary(roles, 'attacker'),
			defender: parseSummary(roles, 'defender'),
		};
	} catch (error) {
		console.error('An error occurred in summary:', error);
		return null;
	}
};
