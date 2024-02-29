import { pgClient } from '@r6index/db/client';
import { LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { ClientLoaderFunction, ClientLoaderFunctionArgs } from '@remix-run/react';
import { getRandomPlayers } from '~/services/players/index.server';

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const env = context.cloudflare.env;
	const dbClient = await pgClient(env.SUPABASE_URL);
	const players = await getRandomPlayers(dbClient);
	return json(players);
};

let firstLoad = true;

export const clientLoader: ClientLoaderFunction = async ({ serverLoader }: ClientLoaderFunctionArgs) => {
	// call the server loader
	if (firstLoad) {
		firstLoad = false;

		const server = await serverLoader();
		sessionStorage.setItem('r6index:popular', JSON.stringify(server));

		return {
			popular: server,
			recent: [],
			bookmarked: [],
		};
	}

	let popularList = [];
	const popular = sessionStorage.getItem('r6index:popular');
	if (popular) {
		popularList = JSON.parse(popular);
	}

	return {
		popular: popularList,
		recent: [],
		bookmarked: [],
	};
};

clientLoader.hydrate = true;

export default function Index() {
	return null;
}
