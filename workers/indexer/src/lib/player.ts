import type { DrizzleClient } from '@r6index/db/client';
import type { Profile } from '@r6index/shared-types/players';
import type { UbisoftCredentials } from '@r6index/shared-types/ubisoft';
import { getPlayerStats } from '@r6index/ubisoft-api-client/requests';
import { insertSimilarPlayers } from '../services/player';
import type { Env } from '../types';

//TODO: fix issue with ubisoft api blocking cloudflare workers by moving logic elsewhere

const fetchStatsForProfile = async (profile: Profile, credentials: UbisoftCredentials, env: Env) => {
	try {
		const stats = await Promise.all([
			getPlayerStats(env, credentials, 'level', { id: profile.profileId }),
			getPlayerStats(env, credentials, 'lastseen', { id: profile.profileId }),
			getPlayerStats(env, credentials, 'ranked', { id: profile.profileId }),
			// getPlayerStats(env, credentials, 'maps', { id: profile.profileId }),
			// getPlayerStats(env, credentials, 'operators', { id: profile.profileId }),
			// getPlayerStats(env, credentials, 'weapons', { id: profile.profileId }),
			// getPlayerStats(env, credentials, 'trends', { id: profile.profileId }),
			// getPlayerStats(env, credentials, 'summary', { id: profile.profileId }),
		]);

		return {
			id: profile.profileId,
			userId: profile.userId,
			name: profile.nameOnPlatform,
			platform: profile.platformType,
			aliases: [
				{
					name: profile.nameOnPlatform,
					date: new Date(Date.now()).toUTCString(),
				},
			],
			level: stats[0],
			lastSeenAt: stats[1],
			ranked: stats[2],
			// maps: stats[3],
			// operators: stats[4],
			// weapons: stats[5],
			// trends: stats[6],
			// summary: stats[7],
		};
	} catch (error) {
		console.error('Error fetching stats for profile:', error);
		return null;
	}
};

export const indexBatch = async (
	user: string,
	batch: string[],
	credentials: UbisoftCredentials,
	env: Env,
	dbClient: DrizzleClient,
) => {
	try {
		const profiles = await getPlayerStats<Profile[]>(env, credentials, 'profile', { id: batch });
		if (!profiles || profiles.length === 0) {
			return;
		}

		const statsPromises = profiles.map((profile) => fetchStatsForProfile(profile, credentials, env));
		const players = await Promise.all(statsPromises);
		const validPlayers = players.filter((player): player is Exclude<(typeof players)[number], null> => player !== null);

		if (validPlayers.length === 0) {
			return;
		}

		const links = validPlayers.map((player) => ({
			id: user,
			similarId: player!.id,
		}));

		await insertSimilarPlayers(dbClient, links, validPlayers);

		console.log('Indexed players:', links);
	} catch (error) {
		console.error('Error indexing players:', error);
	}
};
