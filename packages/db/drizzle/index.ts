import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const client = postgres(process.env.SUPABASE_URL ?? '', {
	max: 1,
});

export const db = drizzle(client, { logger: true });
