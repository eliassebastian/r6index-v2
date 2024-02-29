import { DrizzleClient } from '@r6index/db/client';
import { similar } from '@r6index/db/schema';
import { Param, SQL, sql } from 'drizzle-orm';

export const insertSimilarPlayers = async (
	dbClient: DrizzleClient,
	links: {
		id: string;
		similarId: string;
	}[],
	validPlayers: {
		id: string;
		userId: string;
		name: string;
		platform: 'uplay' | 'xbl' | 'psn';
		aliases: {
			name: string;
			date: string;
		}[];
		level: unknown;
		lastSeenAt: unknown;
		ranked: unknown;
	}[],
) => {
	const sqlChunks: SQL[] = [];
	sqlChunks.push(sql`INSERT INTO players (id, user_id, name, last_seen_at, platform, level, aliases, ranked) VALUES`);

	const values: SQL[] = [];

	for (const player of validPlayers) {
		values.push(
			sql`(${player.id}, ${player.userId}, ${player.name}, ${player.lastSeenAt}, ${player.platform}, ${
				player.level
			}, ${new Param(player.aliases)}, ${player.ranked})`,
		);
	}

	sqlChunks.push(sql.join(values, sql.raw(',')));
	sqlChunks.push(sql`ON CONFLICT (id) DO NOTHING;`);

	const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));

	await dbClient.transaction(async (tx) => {
		try {
			// @ts-ignore
			await tx.execute(finalSql);
			await tx
				.insert(similar)
				.values([...links])
				.onConflictDoNothing();
		} catch (error) {
			console.error('Error inserting similar players:', error);
			tx.rollback();
			return;
		}
	});
};
