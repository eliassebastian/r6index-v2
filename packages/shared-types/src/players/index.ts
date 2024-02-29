export type PlayerFullTextSearch = {
	id: string;
	name: string;
	lastSeenAt: string;
	level: PlayerLevel;
	aliases: PlayerAliases[];
	ranked: PlayerRankedStats;
};

export type PlayerLevel = {
	level: number;
	xp: number;
};

export type PlayerAliases = {
	name: string;
	date: string;
};

export type PlayerRankedStats = {
	maxRank: number;
	seasonId: number;
	rank: number;
	maxRankPoints: number;
	rankPoints: number;
	topRankPosition: number;
	abandons: number;
	losses: number;
	wins: number;
	deaths: number;
	kills: number;
	maxRankText: string;
	rankText: string;
	winLoseRatio: number;
	kdRatio: number;
	seasonName: string;
};

export type PlayerWeaponStats = {
	all: PlayerWeaponStat[] | null;
	attacker: PlayerWeaponStat[] | null;
	defender: PlayerWeaponStat[] | null;
};

export type PlayerWeaponStat = {
	weaponName: string;
	roundsPlayed: number;
	roundsWon: number;
	roundsLost: number;
	kills: number;
	headshots: number;
	headshotAccuracy: number;
	roundsWithAKill: number;
	roundsWithMultiKill: number;
	weaponType: string;
	weaponCategory: string;
	winLossRatio: number;
};

export type PlayerOperatorStats = {
	operatorSide: string;
	name: string;
	matchesPlayed: number;
	roundsPlayed: number;
	minutesPlayed: number;
	matchesWon: number;
	matchesLost: number;
	roundsWon: number;
	roundsLost: number;
	kills: number;
	death: number;
	headshots: number;
	winLossRatio: number;
	killDeathRatio: number;
	headshotAccuracy: number;
	killsPerRound: number;
	roundsWithAKill: number;
	roundsWithMultiKill: number;
	roundsWithOpeningKill: number;
	roundsWithOpeningDeath: number;
	roundsWithKOST: number;
	roundsSurvived: number;
	roundsWithAnAce: number;
	roundsWithClutch: number;
};

export type PlayerTrendSide = 'all' | 'attacker' | 'defender';

export type PlayerTrendStats = {
	[K in PlayerTrendSide]: PlayerTrendStatV2 | null;
};

export type PlayerTrendKey =
	| 'winLossRatio'
	| 'killDeathRatio'
	| 'headshotAccuracy'
	| 'killsPerRound'
	| 'roundsWithAKill'
	| 'roundsWithMultiKill'
	| 'roundsWithKOST'
	| 'roundsSurvived';

export type PlayerTrendStatV2 = {
	[K in PlayerTrendKey]: {
		id: K;
		name: string;
		movingPoint: number;
		data: [
			{
				id: 'trend';
				data: { x: string; y: number }[];
			},
			{
				id: 'actuals';
				data: { x: string; y: number }[];
			},
		];
		high: number;
		average: number;
		low: number;
	};
};

export type TrendType = {
	movingPoint: number;
	name: string;
	high: number;
	average: number;
	low: number;
	trend: Record<string, number>;
	actuals: Record<string, number>;
};

export type PlayerTrendStat = {
	movingPoints: number;
	trends: TrendType[];
};

export type PlayerMapStats = {
	all: PlayerMapStat[] | null;
	attacker: PlayerMapStat[] | null;
	defender: PlayerMapStat[] | null;
};

export type PlayerMapStat = {
	name: string;
	matchesPlayed: number;
	roundsPlayed: number;
	minutesPlayed: number;
	matchesWon: number;
	matchesLost: number;
	roundsWon: number;
	roundsLost: number;
	kills: number;
	death: number;
	headshots: number;
	winLossRatio: number;
	killDeathRatio: number;
	headshotAccuracy: number;
	killsPerRound: number;
	roundsWithAKill: number;
	roundsWithMultiKill: number;
	roundsWithOpeningKill: number;
	roundsWithOpeningDeath: number;
	roundsWithKOST: number;
	roundsSurvived: number;
	roundsWithAnAce: number;
	roundsWithClutch: number;
};

export type PlayerSummaryStats = {
	all: PlayerSummaryStat | null;
	attacker: PlayerSummaryStat | null;
	defender: PlayerSummaryStat | null;
};

export type PlayerSummaryStat = {
	statsDetail: string;
	minutesPlayed: number;
	headshotAccuracy: number;
	killsPerRound: number;
	roundsWithAKill: number;
	roundsWithMultiKill: number;
	roundsWithOpeningKill: number;
	roundsWithOpeningDeath: number;
	roundsWithKOST: number;
	roundsSurvived: number;
	roundsWithAnAce: number;
	roundsWithClutch: number;
};

export type Profiles = {
	profiles: Profile[];
};

export type Profile = {
	profileId: string;
	userId: string;
	platformType: 'uplay' | 'xbl' | 'psn';
	idOnPlatform: string;
	nameOnPlatform: string;
};

export type PopularPlayer = {
	id: string;
	name: string;
	level: PlayerLevel;
	ranked: PlayerRankedStats;
};
