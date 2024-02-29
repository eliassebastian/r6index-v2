import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export type DrizzleClient = ReturnType<typeof drizzle>;

export const pgClient = async (connection: string) => {
	const client = postgres(connection, { prepare: false });
	return drizzle(client);
};
