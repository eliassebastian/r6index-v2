import { exec } from 'node:child_process';

function checkDockerRunning() {
	exec('docker info', (error) => {
		if (error) {
			console.error('Docker is not running. Please start Docker and rerun this script.');
			process.exit(1);
		}

		initializeSupabase();
	});
}

function initializeSupabase() {
	console.log('Initializing Supabase in package/db...');
	exec('pnpm run db:init', (stdout) => {
		console.log(stdout);
	});
}

checkDockerRunning();
