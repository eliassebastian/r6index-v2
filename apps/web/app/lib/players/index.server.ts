import type { DrizzleClient } from '@r6index/db/client';
import type {
	PlayerLevel,
	PlayerMapStats,
	PlayerOperatorStats,
	PlayerRankedStats,
	PlayerSummaryStats,
	PlayerTrendStats,
	PlayerWeaponStats,
	Profile,
} from '@r6index/shared-types/players';
import { getPlayerStats } from '@r6index/ubisoft-api-client/requests';
import type { AppLoadContext } from '@remix-run/cloudflare';
import { getUbisoftCredentials } from '~/services/credentials/index.server';
import { insertNewPlayer, selectPlayerByIdWithSimilar, updateExistingPlayer } from '~/services/players/index.server';
import type { ExistingPlayer, IndexedPlayer } from '~/types/players';
import { getUniqueIds } from '~/utils';

// 30 minutes
const UPDATE_THRESHOLD = 30 * 60 * 1000;

// check if player can be updated based on last update time
const canUpdatePlayer = (date: string) => {
	const lastUpdate = new Date(date).getTime() + UPDATE_THRESHOLD;
	const currentDate = Date.now();
	return currentDate >= lastUpdate;
};

export const getUnindexedPlayer = async (
	id: string,
	env: AppLoadContext['cloudflare']['env'],
): Promise<IndexedPlayer | null> => {
	const credentials = await getUbisoftCredentials(env);
	if (!credentials) {
		throw new Error('Ubisoft credentials not found');
	}

	const profile = await getPlayerStats<Profile[]>(env, credentials, 'profile', {
		id,
	});

	// ubisoft profile not returned
	if (!profile) {
		return null;
	}

	const stats = await Promise.all([
		getPlayerStats<PlayerLevel>(env, credentials, 'level', { id }),
		getPlayerStats<string>(env, credentials, 'lastseen', { id }),
		getPlayerStats<PlayerRankedStats>(env, credentials, 'ranked', { id }),
	]);

	return {
		indexed: false,
		id: profile[0].profileId,
		userId: profile[0].userId,
		name: profile[0].nameOnPlatform,
		platform: profile[0].platformType,
		level: stats[0],
		lastSeenAt: stats[1],
		ranked: stats[2],
		trends: null,
		summary: null,
		operators: null,
		weapons: null,
		maps: null,
		similar: null,
		updatedAt: new Date(Date.now()).toUTCString(),
		aliases: [],
	} satisfies IndexedPlayer;
};

export const updatePlayer = async (
	id: string,
	dbClient: DrizzleClient,
	env: AppLoadContext['cloudflare']['env'],
	existingPlayer?: ExistingPlayer,
): Promise<IndexedPlayer | null> => {
	const credentials = await getUbisoftCredentials(env);
	if (!credentials) {
		throw new Error('Ubisoft credentials not found');
	}

	let profile: any;
	if (env.ENVIRONMENT === 'dev') {
		profile = await Promise.all([
			getPlayerStats<Profile[]>(env, credentials, 'profile', { id }),
			getPlayerStats<PlayerLevel>(env, credentials, 'level', { id }),
			getPlayerStats<string>(env, credentials, 'lastseen', { id }),
			getPlayerStats<PlayerRankedStats>(env, credentials, 'ranked', { id }),
			getPlayerStats<PlayerMapStats>(env, credentials, 'maps', { id }),
			getPlayerStats<PlayerOperatorStats[]>(env, credentials, 'operators', {
				id,
			}),
			getPlayerStats<PlayerWeaponStats>(env, credentials, 'weapons', { id }),
			getPlayerStats<PlayerTrendStats>(env, credentials, 'trends', { id }),
			getPlayerStats<PlayerSummaryStats>(env, credentials, 'summary', { id }),
			getPlayerStats<string[]>(env, credentials, 'similar', { id }),
		]);
	} else {
		// unfortunately, ubisoft api seems to be blocking certain api requests from cloudflare workers in production
		// so we have to use a proxy to make the profle request
		const response = await fetch(env.VERCEL_URL, {
			method: 'POST',
			body: JSON.stringify({ id, credentials }),
		});

		const responseJson = (await response.json()) as { data: any };
		profile = responseJson.data;
	}

	// existing player exists but ubisoft profile not returned so fallback to existing player
	if (existingPlayer && (!profile[0] || profile[0].length === 0)) {
		return { ...existingPlayer, indexed: true } as IndexedPlayer;
	}

	// ubisoft profile not returned
	if (!profile || profile.length === 0) {
		return null;
	}

	// check if player name has changed
	if (existingPlayer && existingPlayer.name !== profile[0][0].nameOnPlatform) {
		existingPlayer.aliases.push({
			name: profile[0][0].nameOnPlatform,
			date: new Date(Date.now()).toUTCString(),
		});
		existingPlayer.name = profile[0][0].nameOnPlatform;
	}

	// check if last seen at is less than existing one
	if (profile[2] && existingPlayer && existingPlayer.lastSeenAt) {
		const lastSeenAt = new Date(profile[2]).getTime();
		const existingLastSeenAt = new Date(existingPlayer.lastSeenAt).getTime();

		if (lastSeenAt < existingLastSeenAt) {
			profile[2] = existingPlayer.lastSeenAt;
		}
	}

	// create new player object / merge existing player with new data
	const newPlayer = {
		indexed: true,
		id: existingPlayer ? existingPlayer.id : profile[0][0].profileId,
		userId: existingPlayer ? existingPlayer.userId : profile[0][0].userId,
		name: existingPlayer ? existingPlayer.name : profile[0][0].nameOnPlatform,
		platform: existingPlayer ? existingPlayer.platform : profile[0][0].platformType,
		aliases: existingPlayer
			? existingPlayer.aliases
			: [
					{
						name: profile[0][0].nameOnPlatform,
						date: new Date(Date.now()).toUTCString(),
					},
			  ],
		updatedAt: new Date(Date.now()).toUTCString(),
		level: profile[1] ?? (existingPlayer ? existingPlayer.level : null),
		lastSeenAt: profile[2] ?? (existingPlayer ? existingPlayer.lastSeenAt : null),
		ranked: profile[3] ?? (existingPlayer ? existingPlayer.ranked : null),
		maps: profile[4] ?? (existingPlayer ? existingPlayer.maps : null),
		operators: profile[5] ?? (existingPlayer ? existingPlayer.operators : null),
		weapons: profile[6] ?? (existingPlayer ? existingPlayer.weapons : null),
		trends: profile[7] ?? (existingPlayer ? existingPlayer.trends : null),
		summary: profile[8] ?? (existingPlayer ? existingPlayer.summary : null),
		similar: existingPlayer ? existingPlayer.similar : null,
	} satisfies IndexedPlayer;

	try {
		const similarPlayerIds = getUniqueIds(existingPlayer?.similar, profile[9]);

		if (similarPlayerIds.length > 0) {
			// Wrangler does not yet support running separate producer and consumer Workers bound to the same Queue locally.
			// https://developers.cloudflare.com/queues/reference/local-development/#known-issues
			if (import.meta.env.MODE !== 'node') {
				await env.QUEUE.send({ id, similar: similarPlayerIds });
			} else {
				console.log('indexing similar players', id, similarPlayerIds);
				await fetch(env.INDEXER_URL, { method: 'POST', body: JSON.stringify({ id, similar: similarPlayerIds }) });
			}
		}

		// if existing player, update player in db else insert new player
		if (existingPlayer) {
			await updateExistingPlayer(id, newPlayer, dbClient);
		} else {
			await insertNewPlayer(newPlayer, dbClient);
		}

		// cache player in production
		if (env.ENVIRONMENT === 'prod') {
			// update player in cache with 30 min expiration if similar players dont exist else 12 hours
			await env.KV.put(`player:${id}`, JSON.stringify(newPlayer), {
				expirationTtl: newPlayer.similar?.length ? 60 * 60 * 12 : 30 * 60,
			});
		}
	} catch (error) {
		console.error(error);
		throw new Error('error updating player');
	}

	return newPlayer;
};

export const getPlayerById = async (
	id: string,
	dbClient: DrizzleClient,
	env: AppLoadContext['cloudflare']['env'],
	index?: boolean,
) => {
	try {
		// is player cached
		const cachedPlayer = await env.KV.get(`player:${id}`);

		// player is cached, check if profile can be updated
		if (cachedPlayer !== null) {
			const player = JSON.parse(cachedPlayer) as IndexedPlayer;

			// If player is cached, check if it can be updated
			if (canUpdatePlayer(player.updatedAt)) {
				const updatedPlayer = await updatePlayer(id, dbClient, env, player);

				// return updated player if it was updated otherwise fallback to cached player
				if (updatedPlayer) {
					return updatedPlayer;
				}
			}

			return player;
		}

		// If not cached, fetch from DB
		const player = await selectPlayerByIdWithSimilar(id, dbClient);

		// player is not found and index flag is false, return unindexed player details
		if (!player && !index) {
			return await getUnindexedPlayer(id, env);
		}

		// player is not found and index flag is true, index player
		if (!player && index) {
			return await updatePlayer(id, dbClient, env);
		}

		if (!player) {
			return null;
		}

		// player is found, check if it can be updated
		if (canUpdatePlayer(player.updatedAt)) {
			console.log('player found and can be updated, updating');
			return await updatePlayer(id, dbClient, env, player);
		}

		return player;
	} catch (error) {
		console.error(error);
	}
};

export const getPlayerByName = async (name: string, env: AppLoadContext['cloudflare']['env']) => {
	const credentials = await getUbisoftCredentials(env);
	if (!credentials) {
		throw new Error('Ubisoft credentials not found');
	}

	const profile = await getPlayerStats<Profile[]>(env, credentials, 'profile', {
		name,
	});

	// ubisoft profile not returned
	if (!profile || profile.length === 0) {
		return null;
	}

	return profile[0].profileId;
};
