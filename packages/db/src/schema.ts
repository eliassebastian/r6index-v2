import type {
	PlayerAliases,
	PlayerLevel,
	PlayerMapStats,
	PlayerOperatorStats,
	PlayerRankedStats,
	PlayerSummaryStats,
	PlayerTrendStats,
	PlayerWeaponStats,
} from '@r6index/shared-types/players';
import type { InferSelectModel } from 'drizzle-orm';
import { index, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const platformEnum = pgEnum('platform', ['uplay', 'xbl', 'psn']);

export type Player = InferSelectModel<typeof players>;

export const players = pgTable('players', {
	id: uuid('id').notNull().primaryKey(),
	userId: uuid('user_id').notNull(), // NOTE: this is the global id that links all platforms to one player
	name: varchar('name', { length: 52 }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).notNull().defaultNow(),
	lastSeenAt: text('last_seen_at'),
	platform: platformEnum('platform').notNull().default('uplay'),
	level: jsonb('level').$type<PlayerLevel | null>(),
	aliases: jsonb('aliases').$type<PlayerAliases[]>().notNull().default([]),
	summary: jsonb('summary').$type<PlayerSummaryStats | null>(),
	trends: jsonb('trends').$type<PlayerTrendStats | null>(),
	operators: jsonb('operators').$type<PlayerOperatorStats[] | null>(),
	weapons: jsonb('weapons').$type<PlayerWeaponStats | null>(),
	maps: jsonb('maps').$type<PlayerMapStats | null>(),
	ranked: jsonb('ranked').$type<PlayerRankedStats | null>(),
});

export const similar = pgTable(
	'similar',
	{
		id: uuid('id')
			.notNull()
			.references(() => players.id, { onDelete: 'cascade' }),
		similarId: uuid('similar_id')
			.notNull()
			.references(() => players.id, { onDelete: 'cascade' }),
	},
	(table) => ({
		pk: primaryKey({
			name: 'pk_similar_users',
			columns: [table.id, table.similarId],
		}),
		idIdx: index('similar_profile_idx').on(table.id),
	}),
);
