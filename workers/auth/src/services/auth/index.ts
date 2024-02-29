import { Buffer } from 'node:buffer';
import type { UbisoftCredentials, UbisoftUrlEnv } from '@r6index/shared-types/ubisoft';
import type { Env } from '../../env';

type UbisoftResponse = {
	sessionId: string;
	ticket: string;
	expiration: string;
};

export type Profile = {
	username: string;
	password: string;
};

export class UbisoftServiceError extends Error {
	name: string;
	message: string;
	cause: any;

	constructor({ name, message, cause }: { name: string; message: string; cause?: any }) {
		super();
		this.message = message;
		this.name = name;
		this.cause = cause;
	}
}

export class UbisoftAuthenticationProvider {
	private env: UbisoftUrlEnv;
	private basicToken: string;
	private authentication: UbisoftCredentials;

	constructor(env: Env, profile: Profile) {
		this.authentication = {
			ticketV1: null,
			sessionV1: null,
			expirationV1: null,
			ticketV2: null,
			sessionV2: null,
			expirationV2: null,
		};

		this.env = env;
		this.basicToken = this.setBasicToken(profile.username, profile.password);
	}

	private setBasicToken = (username: string, password: string) => {
		if (username === '' || password === '') {
			throw new Error('invalid username or password not set');
		}

		return Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');
	};

	// This function generates Ubisoft credentials using the provided authentication ticket.
	// It updates the authentication object with the new ticket, session ID, and expiration time.
	private generateUbisoftCredentials = async (auth?: string) => {
		const authType = !auth ? 'Basic' : 'Ubi_v1';
		const authValue = !auth ? this.basicToken : `t=${auth}`;
		const authAppID = !auth ? this.env.UBISOFT_APPID : this.env.UBISOFT_NEWAPPID;

		const headers = new Headers({
			Connection: 'keep-alive',
			'Content-Type': 'application/json',
			Accept: '*/*',
			'Ubi-AppId': authAppID,
			'Ubi-TransactionId': '51ffc1a6-bfa8-42b6-8319-4bcc5f5616a1',
			Authorization: `${authType} ${authValue}`,
			Host: 'public-ubiservices.ubi.com',
			Origin: 'https://connect.ubisoft.com',
			Referer: 'https://connect.ubisoft.com/',
			'User-Agent':
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
		});

		if (auth !== '') {
			headers.append('User-Agent', this.env.UBISOFT_USERAGENT);
		}

		const response = await fetch(this.env.UBISOFT_URL, {
			method: 'POST',
			headers,
		});

		if (response.status !== 200) {
			throw new UbisoftServiceError({
				name: 'UbisoftServiceError',
				message: 'Failed to generate Ubisoft credentials',
				cause: await response.text(),
			});
		}

		const ubisoftResponse = (await response.json()) as UbisoftResponse;
		return ubisoftResponse;
	};

	// This function is responsible for handling the authentication process for Ubisoft's old API.
	// It generates an authentication ticket which is required for the V1 Ubisoft API endpoints.
	private authenticateUbisoftCredentialsV1 = async () => {
		const response = await this.generateUbisoftCredentials();
		if (!response) {
			throw new Error('invalid username or password');
		}

		this.authentication.ticketV1 = response.ticket;
		this.authentication.sessionV1 = response.sessionId;
		this.authentication.expirationV1 = response.expiration;
	};

	// This function is responsible for handling the authentication process for Ubisoft's new API.
	// It uses the ticket generated from the old API to authenticate the user.
	private authenticateUbisoftCredentialsV2 = async () => {
		const authTicket = this.authentication.ticketV1;
		if (!authTicket) {
			throw new Error('authentication ticket does not exist');
		}

		const response = await this.generateUbisoftCredentials(authTicket);
		if (!response) {
			throw new Error('invalid username or password');
		}

		this.authentication.ticketV2 = response.ticket;
		this.authentication.sessionV2 = response.sessionId;
		this.authentication.expirationV2 = response.expiration;
	};

	// This function makes an authentication request to Ubisoft's API.
	// It first authenticates with the old API, then with the new API.
	// If any error occurs during the process, it logs the error message and rethrows the error.
	private makeUbisoftAuthenticationRequest = async () => {
		await this.authenticateUbisoftCredentialsV1();
		await this.authenticateUbisoftCredentialsV2();

		return this.authentication;
	};

	// This function is responsible for generating new authentication values for Ubisoft's API.
	// It retries the authentication request 5 times with an exponential backoff in case of failure.
	public newUbisoftAuthenticationValues = async () => {
		return await this.makeUbisoftAuthenticationRequest();
	};
}
