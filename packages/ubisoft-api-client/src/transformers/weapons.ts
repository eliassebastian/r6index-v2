import { calculateRatio } from '../utils';

const parseWeapons = (roles: any, roleKey: 'all' | 'attacker' | 'defender') => {
	try {
		const weapons = roles[roleKey];
		if (Array.isArray(weapons)) return null;
		if (!weapons || weapons.length === 0) return null;

		return [
			...weapons.weaponSlots.secondaryWeapons.weaponTypes.flatMap((wt: any) =>
				wt.weapons.map((w: any) => ({
					...w,
					weaponType: wt.weaponType,
					weaponCategory: 'secondary',
					winLossRatio: calculateRatio(w.roundsWon, w.roundsLost),
				})),
			),
			...weapons.weaponSlots.primaryWeapons.weaponTypes.flatMap((wt: any) =>
				wt.weapons.map((w: any) => ({
					...w,
					weaponType: wt.weaponType,
					weaponCategory: 'primary',
					winLossRatio: calculateRatio(w.roundsWon, w.roundsLost),
				})),
			),
		];
	} catch (error) {
		return null;
	}
};

export const transform = (data: any, id: string) => {
	try {
		const platform = data.platforms.PC ?? data.platforms.XONE;
		if (!platform) return null;

		const roles = platform.gameModes.ranked.teamRoles;

		return {
			all: parseWeapons(roles, 'all'),
			attacker: parseWeapons(roles, 'attacker'),
			defender: parseWeapons(roles, 'defender'),
		};
	} catch (error) {
		console.error('An error occurred in weapons:', error);
		return null;
	}
};
