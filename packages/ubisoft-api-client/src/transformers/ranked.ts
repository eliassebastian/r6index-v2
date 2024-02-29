import { UbisoftRankedConfig } from '../config/ranked';
import { UbisoftSeasonsConfig } from '../config/seasons';
import { calculateRatio } from '../utils';

export const transform = (data: any) => {
	try {
		const profiles = data.platform_families_full_profiles[0].board_ids_full_profiles;
		const ranked = profiles.find((b: any) => b.board_id === 'ranked');
		if (!ranked) return null;
		if (!ranked.full_profiles.length) return null;

		return {
			maxRank: ranked.full_profiles[0].profile.max_rank,
			seasonId: ranked.full_profiles[0].profile.season_id,
			rank: ranked.full_profiles[0].profile.rank,
			maxRankPoints: ranked.full_profiles[0].profile.max_rank_points,
			rankPoints: ranked.full_profiles[0].profile.rank_points,
			topRankPosition: ranked.full_profiles[0].profile.top_rank_position,
			abandons: ranked.full_profiles[0].season_statistics.match_outcomes.abandons,
			losses: ranked.full_profiles[0].season_statistics.match_outcomes.losses,
			wins: ranked.full_profiles[0].season_statistics.match_outcomes.wins,
			deaths: ranked.full_profiles[0].season_statistics.deaths,
			kills: ranked.full_profiles[0].season_statistics.kills,
			maxRankText: UbisoftRankedConfig[ranked.full_profiles[0].profile.max_rank]!.name,
			rankText: UbisoftRankedConfig[ranked.full_profiles[0].profile.rank]!.name,
			winLoseRatio: calculateRatio(
				ranked.full_profiles[0].season_statistics.match_outcomes.wins,
				ranked.full_profiles[0].season_statistics.match_outcomes.losses,
			),
			kdRatio: calculateRatio(
				ranked.full_profiles[0].season_statistics.kills,
				ranked.full_profiles[0].season_statistics.deaths,
			),
			seasonName: UbisoftSeasonsConfig[ranked.full_profiles[0].profile.season_id]!.name,
		};
	} catch (error) {
		console.error('An error occurred in ranked:', error);
		return null;
	}
};
