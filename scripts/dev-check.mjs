import { exec } from 'node:child_process';

const containerName = 'supabase_db_r6index'; // Replace with your Supabase container name

function checkContainerStatus() {
	const command = `docker ps --filter "status=running" --filter "name=^${containerName}$"`;

	exec(command, (error, stdout) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			process.exit(1);
		}

		if (stdout.includes(containerName)) {
			console.log(`The Supabase container '${containerName}' is running.`);
		} else {
			console.log('Supabase is not running. Please start it before proceeding.');
			process.exit(1);
		}
	});
}

checkContainerStatus();
