import { SEASON_CODE, SEASON_START } from './constants';
import { transform as transformLastSeen } from './transformers/lastseen';
import { transform as transformMaps } from './transformers/maps';
import { transform as transformOperators } from './transformers/operators';
import { transform as transformProfile } from './transformers/profile';
import { transform as transformRanked } from './transformers/ranked';
import { transform as transformSummary } from './transformers/summary';
import { transform as transformTrends } from './transformers/trends';
import { transform as transformWeapons } from './transformers/weapons';

type BaseParams = { id: string };
type ProfileParams = { name?: string; id?: string | string[] };

export type UbisoftAPIConfigKey = keyof typeof BaseUbisoftURLs;
export type UbisoftAPIURLParameters<T extends UbisoftAPIConfigKey> = Parameters<(typeof BaseUbisoftURLs)[T]['url']>[0];

const BaseUbisoftURLs = {
	profile: {
		url: ({ name, id }: ProfileParams) => {
			const baseURL = 'https://public-ubiservices.ubi.com/v3/profiles';

			// If name is provided, prioritize it over uuid
			if (name) {
				return `${baseURL}?namesOnPlatform=${name}&platformType=uplay`;
			}

			// Check for uuid and handle both string and array cases
			if (id) {
				const uuidParam = Array.isArray(id) ? `profileIds=${id.join(',')}` : `userIds=${id}`;
				return `${baseURL}?${uuidParam}`;
			}

			// Return a default URL or handle this case based on your use case
			return baseURL;
		},
		useSessionV2: false,
		useHeaderV2: false,
		transform: transformProfile,
	},
	lastseen: {
		url: ({ id }: BaseParams) => {
			return `https://public-ubiservices.ubi.com/v1/spaces/5172a557-50b5-4665-b7db-e3f2e8c5041d/sandboxes/OSBOR_PC_LNCH_A/r6karma/player_skill_records?board_ids=pvp_ranked&region_ids=global&season_ids=27&profile_ids=${id}`;
		},
		useSessionV2: false,
		useHeaderV2: false,
		transform: transformLastSeen,
	},
	level: {
		url: ({ id }: BaseParams) => {
			return `https://public-ubiservices.ubi.com/v1/spaces/0d2ae42d-4c27-4cb7-af6c-2099062302bb/title/r6s/rewards/public_profile?profile_id=${id}`;
		},
		useSessionV2: true,
		useHeaderV2: false,
	},
	maps: {
		url: ({ id }: BaseParams) => {
			return `https://prod.datadev.ubisoft.com/v1/profiles/${id}/playerstats?spaceId=5172a557-50b5-4665-b7db-e3f2e8c5041d&view=current&aggregation=maps&gameMode=ranked&platformGroup=PC&teamRole=all,attacker,defender&startDate=${SEASON_START}`;
		},
		useSessionV2: false,
		useHeaderV2: true,
		transform: transformMaps,
	},
	operators: {
		url: ({ id }: BaseParams) => {
			return `https://prod.datadev.ubisoft.com/v1/profiles/${id}/playerstats?spaceId=5172a557-50b5-4665-b7db-e3f2e8c5041d&view=current&aggregation=operators&gameMode=ranked&platformGroup=PC&teamRole=Attacker,Defender&startDate=${SEASON_START}`;
		},
		useSessionV2: false,
		useHeaderV2: true,
		transform: transformOperators,
	},
	ranked: {
		url: ({ id }: BaseParams) => {
			return `https://public-ubiservices.ubi.com/v2/spaces/0d2ae42d-4c27-4cb7-af6c-2099062302bb/title/r6s/skill/full_profiles?profile_ids=${id}&platform_families=pc`;
		},
		useSessionV2: true,
		useHeaderV2: false,
		transform: transformRanked,
	},
	similar: {
		url: ({ id }: BaseParams) => {
			return `https://prod.datadev.ubisoft.com/v1/profiles/${id}/playerstats?spaceId=5172a557-50b5-4665-b7db-e3f2e8c5041d&view=current&aggregation=friends&platformGroup=PC`;
		},
		useSessionV2: false,
		useHeaderV2: true,
	},
	summary: {
		url: ({ id }: BaseParams) => {
			return `https://prod.datadev.ubisoft.com/v1/profiles/${id}/playerstats?spaceId=5172a557-50b5-4665-b7db-e3f2e8c5041d&view=seasonal&aggregation=summary&gameMode=ranked&platformGroup=PC&teamRole=all,attacker,defender&seasons=${SEASON_CODE}`;
		},
		useSessionV2: false,
		useHeaderV2: true,
		transform: transformSummary,
	},
	trends: {
		url: ({ id }: BaseParams) => {
			return `https://prod.datadev.ubisoft.com/v1/profiles/${id}/playerstats?spaceId=5172a557-50b5-4665-b7db-e3f2e8c5041d&view=current&aggregation=movingpoint&trendType=days&gameMode=ranked&platformGroup=PC&teamRole=all,attacker,defender&startDate=${SEASON_START}`;
		},
		useSessionV2: false,
		useHeaderV2: true,
		transform: transformTrends,
	},
	weapons: {
		url: ({ id }: BaseParams) => {
			return `https://prod.datadev.ubisoft.com/v1/profiles/${id}/playerstats?spaceId=5172a557-50b5-4665-b7db-e3f2e8c5041d&view=current&aggregation=weapons&gameMode=ranked&platformGroup=PC&teamRole=all,attacker,defender&startDate=${SEASON_START}`;
		},
		useSessionV2: false,
		useHeaderV2: true,
		transform: transformWeapons,
	},
};

export function getUbisoftURLConfig<T extends UbisoftAPIConfigKey>(key: T) {
	return BaseUbisoftURLs[key];
}
