import { UbisoftServiceError } from './errors';
import { Env, UbisoftCredentials } from './types';
import { UbisoftAPIConfigKey, UbisoftAPIURLParameters, getUbisoftURLConfig } from './url';
import { retryWithExponentialBackoff } from './utils';

// A generic function to handle API requests with improved error handling and flexibility
async function fetchUbisoftData<T>(url: string, headers: Record<string, string>): Promise<T | null> {
	try {
		const response = await fetch(url, { method: 'GET', headers });

		// if the response is not considered okay, return ubisoft service error
		if (!response.ok) {
			throw new UbisoftServiceError({
				name: 'UbisoftServiceError',
				message: `response not 200 but ${response.status}`,
				cause: await response.text(),
			});
		}

		// if the response is 204 due to no content from ubisoft return null
		if (response.status === 204) return null;

		// if the response is not 200, throw an ubisoft service error for exponential backoff
		if (response.status !== 200) {
			throw new UbisoftServiceError({
				name: 'UbisoftServiceError',
				message: `response not 200 but ${response.status}`,
				cause: await response.text(),
			});
		}

		return (await response.json()) as T;
	} catch (error) {
		if (error instanceof UbisoftServiceError) {
			console.error(`fetchUbisoftData: ${error.cause}`);
			throw error;
		}

		return null;
	}
}

// Unified function to fetch player stats
export async function getPlayerStats<T>(
	env: Env,
	credentials: UbisoftCredentials,
	apiKey: UbisoftAPIConfigKey,
	params: UbisoftAPIURLParameters<typeof apiKey>,
): Promise<T | null> {
	const config = getUbisoftURLConfig(apiKey);
	if (!config) {
		throw new Error(`invalid API config: ${apiKey}`);
	}

	const url = config.url(params as any);

	const si = config.useSessionV2 ? credentials.sessionV2 : credentials.sessionV1;
	const av = `t=${config.useSessionV2 ? credentials.ticketV2 : credentials.ticketV1}`;
	const ai = config.useSessionV2 ? env.UBISOFT_NEWAPPID : env.UBISOFT_APPID;
	const exp = config.useSessionV2 ? credentials.expirationV2 : credentials.expirationV1;
	if (!exp || !si) {
		throw new Error('credentials not found');
	}

	const headers: { [key: string]: string } = {
		Connection: 'keep-alive',
		'Content-Type': 'application/json',
		Accept: '*/*',
		'Ubi-SessionId': si,
		'Ubi-AppId': ai,
		expiration: exp,
		Authorization: `Ubi_v1 ${av}`,
	};

	if (config.useSessionV2 || config.useHeaderV2) {
		//headers["User-Agent"] = env.UBISOFT_USERAGENT;
		headers['User-Agent'] =
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15';
	}

	if (config.useHeaderV2) {
		headers.Host = 'prod.datadev.ubisoft.com';
		headers['Accept-Encoding'] = 'gzip, deflate, br';
		headers['Accept-Language'] = 'en-US,en;q=0.9';
		headers.Origin = 'https://www.ubisoft.com';
		headers.Referer = 'https://www.ubisoft.com/';
	}

	try {
		const response = await retryWithExponentialBackoff(fetchUbisoftData, {
			fnArgs: [url, headers],
			maxRetries: 1,
		});

		if (!response) return null;

		// @ts-ignore
		// if a transform function is provided, use it to transform the response
		if (config.transform) {
			// @ts-ignore
			return config.transform(response, params.id) as T;
		}

		return response as T;
	} catch (error) {
		console.error(`getPlayerStats: ${error}`);
		return null;
	}
}
