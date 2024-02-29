import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

export type DrizzleClient = ReturnType<typeof drizzle>;

export const pgClient = async (connection: string) => {
	const client = new pg.Pool({
		connectionString: connection,
	});

	return drizzle(client);
};
