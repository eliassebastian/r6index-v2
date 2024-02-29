import { exec } from 'node:child_process';

function checkContainerStatus() {
	exec('pnpm run db:status', (error, stdout) => {
		if (stdout.includes('DB URL')) {
			console.log('Supabase running.');
		} else {
			console.log('Supabase is not running. Please start it before proceeding.');
			process.exit(1);
		}
	});
}

checkContainerStatus();
