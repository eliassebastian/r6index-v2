import { AppLoadContext } from '@remix-run/cloudflare';

export type UbisoftCredentials = {
	ticketV1: string | null;
	sessionV1: string | null;
	expirationV1: string | null;
	ticketV2: string | null;
	sessionV2: string | null;
	expirationV2: string | null;
};

export const getUbisoftCredentials = async (env: AppLoadContext['cloudflare']['env']) => {
	const credentials = await env.KV.get('credentials:ubisoft');
	if (!credentials) {
		console.error('Failed to get Ubisoft credentials');
		return null;
	}

	return JSON.parse(credentials) as UbisoftCredentials;
};
