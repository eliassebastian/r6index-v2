import type { DrizzleClient } from '@r6index/db/client';
import { players, similar } from '@r6index/db/schema';
import type { PlayerFullTextSearch, PopularPlayer } from '@r6index/shared-types/players';
import { Param, eq, sql } from 'drizzle-orm';
import type { ExistingPlayer, IndexedPlayer } from '~/types/players';

export const selectPlayerById = async (id: string, dbClient: DrizzleClient) => {
	return await dbClient.select().from(players).where(eq(players.id, id)).limit(1);
};

export const selectPlayerByIdWithSimilar = async (id: string, dbClient: DrizzleClient) => {
	const query = sql`SELECT
    p.id,
    p.platform,
    p.name,
    p.level,
    p.summary,
    p.trends,
    p.operators,
    p.weapons,
    p.maps,
    p.ranked,
    p.aliases,
    p.last_seen_at AS lastSeenAt,
    p.updated_at AS updatedAt,
    CASE
        WHEN COUNT(sp.id) = 0 THEN '[]'::json
        ELSE json_agg(
            json_build_object(
                'id', sp.id,
                'name', sp.name,
                'platform', sp.platform,
                'level', sp.level
            )
        )
    END AS similar
FROM
    ${players} p
LEFT JOIN (
    SELECT
        s.id,
        s.similar_id,
        ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY (sp.level->>'level')::int DESC) as rn
    FROM
        ${similar} s
    JOIN ${players} sp ON
        s.similar_id = sp.id
) ranked_similar ON
    p.id = ranked_similar.id AND ranked_similar.rn <= 5
LEFT JOIN ${players} sp ON
    ranked_similar.similar_id = sp.id
WHERE
    p.id = ${id}
GROUP BY
    p.id;`;

	const results = await dbClient.execute(query);
	let player: ExistingPlayer & { lastseenat: string; updatedat: string };

	if (import.meta.env.MODE === 'node') {
		// @ts-expect-error - drizzle pg type wrong for rows
		if (results.rows.length === 0) {
			return null;
		}

		// @ts-expect-error - drizzle pg type wrong for rows
		player = results.rows[0] as ExistingPlayer & {
			lastseenat: string;
			updatedat: string;
		};
	} else {
		if (results.length === 0) {
			return null;
		}

		player = results[0] as ExistingPlayer & {
			lastseenat: string;
			updatedat: string;
		};
	}

	return {
		...player,
		lastSeenAt: player.lastseenat,
		updatedAt: player.updatedat,
		indexed: true,
	} as IndexedPlayer;
};

export const updateExistingPlayer = async (id: string, player: ExistingPlayer, dbClient: DrizzleClient) => {
	const query = sql`UPDATE 
    players 
    SET
      name = COALESCE(${player.name}, name),
      aliases = COALESCE(${import.meta.env.MODE === 'node' ? JSON.stringify(player.aliases) : new Param(player.aliases)}, aliases),
      level = COALESCE(${player.level}, level),
      summary = COALESCE(${player.summary}, summary),
      trends = COALESCE(${player.trends}, trends),
      operators = COALESCE(${
				import.meta.env.MODE === 'node' ? JSON.stringify(player.operators) : new Param(player.operators)
			}, operators),
      weapons = COALESCE(${player.weapons}, weapons),
      maps = COALESCE(${player.maps}, maps),
      ranked = COALESCE(${player.ranked}, ranked),
      last_seen_at = COALESCE(${player.lastSeenAt}, last_seen_at),
      updated_at = NOW()
    WHERE 
      id = ${id};
  `;

	return await dbClient.execute(query);
};

export const insertNewPlayer = async (player: ExistingPlayer, dbClient: DrizzleClient) => {
	// current bug with drizzle orm and jsonb insert values
	// have to use sql template literal
	const query = sql`INSERT INTO
    players (
      id,
      user_id,
      name,
      level,
      summary,
      trends,
      operators,
      weapons,
      maps,
      ranked,
      aliases,
      last_seen_at
    ) VALUES (
      ${player.id},
      ${player.userId},
      ${player.name},
      ${player.level},
      ${player.summary},
      ${player.trends},
      ${import.meta.env.MODE === 'node' ? JSON.stringify(player.operators) : new Param(player.operators)},
      ${player.weapons},
      ${player.maps},
      ${player.ranked},
      ${import.meta.env.MODE === 'node' ? JSON.stringify(player.aliases) : new Param(player.aliases)},
      ${player.lastSeenAt}
    );
  `;

	return await dbClient.execute(query);
};

export const getPlayersWithFullTextSearch = async (query: string, dbClient: DrizzleClient) => {
	if (query.length < 3) {
		return [];
	}

	const template = sql`SELECT id, name, last_seen_at, level, aliases, ranked FROM players WHERE alias_fts &@ ${query} LIMIT 50;`;
	let result = await dbClient.execute(template);

	// handle node db client response
	if (import.meta.env.MODE === 'node') {
		// @ts-expect-error - drizzle pg type wrong for rows
		result = result.rows;
	}

	return result.map((row) => ({
		...row,
		lastSeenAt: row.last_seen_at,
	})) as unknown as PlayerFullTextSearch[];
};

export const getRandomPlayers = async (dbClient: DrizzleClient) => {
	const query = sql`SELECT id, name, level, ranked
        FROM players
        ORDER BY random()
        LIMIT 5;`;

	let result = await dbClient.execute<PopularPlayer>(query);
	// @ts-expect-error - drizzle pg type wrong for rows
	result = import.meta.env.MODE === 'node' ? result.rows : result;
	return result;
};
