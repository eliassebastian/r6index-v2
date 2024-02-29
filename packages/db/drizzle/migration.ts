import * as path from 'node:path';
import { fileURLToPath } from 'url';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '.';

async function main() {
	if (!process.env.SUPABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}

	console.log('⏳ Running migrations...');
	const t0 = performance.now();

	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const migrationsPath = path.join(__dirname, 'migrations');
	await migrate(db, { migrationsFolder: migrationsPath });

	const t1 = performance.now();
	console.log(`✅ Migration ended and took ${t1 - t0} milliseconds.`);

	process.exit(0);
}

main().catch((err) => {
	console.error('❌ Migration failed');
	console.error(err);
	throw err;
});
