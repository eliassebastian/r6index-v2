import * as path from 'node:path';
import { fileURLToPath } from 'url';
import { client } from '.';

async function main() {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	await client.file(`${__dirname}/seed.sql`);
	console.log('✅ Seed ended');
	process.exit(0);
}

main().catch((err) => {
	console.error('❌ Seed failed');
	console.error(err);
	throw err;
});
