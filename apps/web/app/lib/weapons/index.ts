const calculateWeaponScore = (w: any) =>
	w.roundsWon * 1 +
	w.roundsPlayed * 0.5 +
	w.kills * 0.5 +
	w.headshots * 2 +
	w.headshotAccuracy * 10 +
	w.roundsWithAKill * 5 +
	w.roundsWithMultiKill * 5;

export const calculateTopWeapons = (weapons: any[] | null, topX = 1) => {
	if (!weapons || !weapons.length) return [];

	// Calculate score for each weapon and store it along with the weapon
	const weaponsWithScore = weapons.map((weapon) => ({
		weapon,
		score: calculateWeaponScore(weapon),
	}));

	// Sort weapons based on the score in descending order
	weaponsWithScore.sort((a, b) => b.score - a.score);

	// Get the top 'x' weapons
	return weaponsWithScore.slice(0, topX).map((ws) => ws.weapon);
};
