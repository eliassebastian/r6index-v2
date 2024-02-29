import type {
	PlayerLevel,
	PlayerMapStats,
	PlayerOperatorStats,
	PlayerRankedStats,
	PlayerSummaryStats,
	PlayerTrendStats,
	PlayerWeaponStats,
	Profile,
} from '@r6index/shared-types/players';
import { getPlayerStats } from '@r6index/ubisoft-api-client/requests';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const UBISOFT_URL = 'https://public-ubiservices.ubi.com/v3/profiles/sessions';
const UBISOFT_APPID = '3587dcbb-7f81-457c-9781-0e3f29f6f56a';
const UBISOFT_NEWAPPID = 'e3d5ea9e-50bd-43b7-88bf-39794f4e3d40';
const UBISOFT_USERAGENT = 'UbiServices_SDK_2020.Release.58_PC64_ansi_static';

export async function POST(request: Request) {
	console.log('POST req /api/profile');
	console.log('request headers', request.headers.forEach(console.log));

	const body = await request.json();
	const { id, credentials } = body;

	if (!id || !credentials) {
		return Response.json({ error: 'invalid request' }, { status: 400 });
	}

	const env = {
		UBISOFT_URL,
		UBISOFT_APPID,
		UBISOFT_NEWAPPID,
		UBISOFT_USERAGENT,
	};

	const profile = await Promise.all([
		getPlayerStats<Profile[]>(env, credentials, 'profile', { id }),
		getPlayerStats<PlayerLevel>(env, credentials, 'level', { id }),
		getPlayerStats<string>(env, credentials, 'lastseen', { id }),
		getPlayerStats<PlayerRankedStats>(env, credentials, 'ranked', { id }),
		getPlayerStats<PlayerMapStats>(env, credentials, 'maps', { id }),
		getPlayerStats<PlayerOperatorStats[]>(env, credentials, 'operators', {
			id,
		}),
		getPlayerStats<PlayerWeaponStats>(env, credentials, 'weapons', { id }),
		getPlayerStats<PlayerTrendStats>(env, credentials, 'trends', { id }),
		getPlayerStats<PlayerSummaryStats>(env, credentials, 'summary', { id }),
		getPlayerStats<string[]>(env, credentials, 'similar', { id }),
	]);

	return Response.json({ data: profile });
}
