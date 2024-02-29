import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const asyncExec = promisify(exec);

function checkDockerRunning() {
	exec('docker info', (error) => {
		if (error) {
			console.error('Docker is not running. Please start Docker and rerun this script.');
			process.exit(1);
		}

		initializeSupabase();
	});
}

async function initializeSupabase() {
	try {
		console.log('Setting up Supabase for the first time (1/3)');
		await asyncExec('pnpm run db:start');

		console.log('Running initial migrations (2/3)');
		await asyncExec('pnpm run db:migrations:apply:local');

		console.log('Seeding data. This may take a moment. (3/3)');
		await asyncExec('pnpm run db:seed:local');

		console.log('Supabase setup complete');
	} catch (error) {
		await asyncExec('pnpm run db:reset');
		await asyncExec('pnpm run db:stop');
		console.error("Couldn't set up Supabase");
		console.error(error);
		process.exit(1);
	}
}

checkDockerRunning();
