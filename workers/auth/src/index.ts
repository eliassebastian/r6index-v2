import { Env } from './env';
import { createCredentialRotator } from './lib/auth';
import { UbisoftAuthenticationProvider, UbisoftServiceError } from './services/auth';
import { put } from './services/kv';

const BACKOFF_TIMES = [60 * 1000, 5 * 60 * 1000, 10 * 60 * 1000, 15 * 60 * 1000];

export default {
	async fetch(): Promise<Response> {
		return new Response('permission denied', { status: 403 });
	},

	// this worker handler is called when the cron job is triggered.
	async scheduled(event: ScheduledEvent, env: Env) {
		const id = env.DO.idFromName('r6index:scheduler');
		const obj = env.DO.get(id, { locationHint: 'weur' });
		return await obj.fetch('https://example.com/generate');
	},
};

export class SchedulerDurableObject implements DurableObject {
	private state: DurableObjectState;
	private env: Env;
	private lastUsedProfile: number;
	private retryCount: number;
	private isHydrated = false;

	constructor(state: DurableObjectState, env: Env) {
		this.state = state;
		this.env = env;
		this.lastUsedProfile = -1;
		this.retryCount = 0;
	}

	private hydrate = async () => {
		if (this.isHydrated) {
			return;
		}

		this.retryCount = (await this.state.storage.get<number>('r6index:retryCount')) ?? 0;
		this.lastUsedProfile = (await this.state.storage.get<number>('r6index:profile')) ?? -1;
		this.isHydrated = true;
	};

	private generateCredentials = async () => {
		const profiles = [
			{
				username: this.env.UBISOFT_CLIENT_ID_1,
				password: this.env.UBISOFT_CLIENT_PASSWORD_1,
			},
			{
				username: this.env.UBISOFT_CLIENT_ID_2,
				password: this.env.UBISOFT_CLIENT_PASSWORD_2,
			},
			{
				username: this.env.UBISOFT_CLIENT_ID_3,
				password: this.env.UBISOFT_CLIENT_PASSWORD_3,
			},
			{
				username: this.env.UBISOFT_CLIENT_ID_4,
				password: this.env.UBISOFT_CLIENT_PASSWORD_4,
			},
		];

		const rotator = createCredentialRotator(profiles, this.lastUsedProfile);
		const profile = rotator.getNextProfile();
		const newProfileIndex = rotator.getCurrentIndex();

		await this.state.storage.put('r6index:profile', newProfileIndex);

		const ubisoftAuthProvider = new UbisoftAuthenticationProvider(this.env, profile);
		const ubisoftCredentials = await ubisoftAuthProvider.newUbisoftAuthenticationValues();
		if (!ubisoftCredentials) {
			console.error('failed to generate ubisoft credentials');
			return;
		}

		await put(this.env.KV, 'credentials:ubisoft', ubisoftCredentials);
	};

	async fetch(request: Request) {
		const url = new URL(request.url);

		if (url.pathname !== '/generate') {
			return new Response('pong');
		}

		await this.hydrate();

		try {
			await this.generateCredentials();
		} catch (error) {
			if (error instanceof UbisoftServiceError) {
				console.error('failed to generate ubisoft credentials');

				if (this.retryCount <= 5) {
					this.retryCount++;
					await this.state.storage.put('r6index:retryCount', this.retryCount);

					const delay = BACKOFF_TIMES[this.retryCount - 1] as number;
					this.state.storage.setAlarm(Date.now() + delay);

					console.error(`retrying count ${this.retryCount} in ${delay}ms`);
					return new Response('retrying in 5 minutes', { status: 500 });
				}
			}
		}

		this.retryCount = 0;
		await this.state.storage.delete('r6index:retryCount');

		return new Response('credentials generated');
	}

	async alarm() {
		console.log('alarm triggered');

		await this.hydrate();

		try {
			await this.generateCredentials();
		} catch (error) {
			if (error instanceof UbisoftServiceError) {
				console.error('failed to generate ubisoft credentials');
				if (this.retryCount <= 5) {
					this.retryCount++;
					await this.state.storage.put('r6index:retryCount', this.retryCount);

					const delay = BACKOFF_TIMES[this.retryCount - 1] as number;
					this.state.storage.setAlarm(Date.now() + delay);

					console.error(`retrying count ${this.retryCount} in ${delay}ms`);
					return;
				}
			}
		}

		this.retryCount = 0;
		await this.state.storage.delete('r6index:retryCount');
	}
}
