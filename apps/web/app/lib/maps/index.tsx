import { Fragment } from 'react';

const calculateMapScore = (map: any) => {
	const minutesPlayedScore = map.minutesPlayed * 0.2;
	const roundsPlayedScore = (map.roundsWon / map.roundsPlayed) * 0.2;
	const matchesPlayedScore = (map.matchesWon / map.matchesPlayed) * 0.3;
	const kostScore = map.roundsWithKOST * 0.3;

	return minutesPlayedScore + roundsPlayedScore + matchesPlayedScore + kostScore;
};

export const calculateBestMap = (maps: any[] | null) => {
	if (!maps || !maps.length) return undefined;

	return maps.reduce((topMap, currentMap) => {
		return calculateMapScore(currentMap) > calculateMapScore(topMap) ? currentMap : topMap;
	});
};

export const normaliseMapTitle = (map: string, capitalise?: boolean) => {
	const modifiedMap = map.replace(/\s*V2$/, '');
	return capitalise ? modifiedMap.charAt(0).toUpperCase() + modifiedMap.slice(1).toLowerCase() : modifiedMap;
};

export function generateMapRecap(map: any) {
	const {
		killDeathRatio,
		kills,
		headshotAccuracy,
		roundsWithKOST,
		roundsWithOpeningKill,
		roundsWithClutch,
		winLossRatio,
	} = map;

	const recapPoints = [];

	// Round Performance
	recapPoints.push(`W/L ratio of ${winLossRatio.toFixed(1)} and a K/D ratio of ${killDeathRatio.toFixed(1)}.`);

	if (headshotAccuracy > 0.5) {
		// Kill Stats
		recapPoints.push(`${kills} kills with a ${Math.round(headshotAccuracy * 100)}% headshot rate.`);
	}

	// Survival and Consistency
	recapPoints.push(`${Math.round(roundsWithKOST * 100)}% KOST rounds.`);

	if (roundsWithOpeningKill >= 0.1) {
		recapPoints.push(`${Math.round(roundsWithOpeningKill * 100)}% opening kills.`);
	}

	if (roundsWithClutch > 0.05) {
		// Clutch Plays
		recapPoints.push(`${Math.round(roundsWithClutch * 100)}% clutch plays.`);
	}

	const recapJSX = recapPoints.map((point, index) => (
		<Fragment key={index}>
			{point}
			{index < recapPoints.length - 1 && <br />}
		</Fragment>
	));

	return recapJSX;
}
