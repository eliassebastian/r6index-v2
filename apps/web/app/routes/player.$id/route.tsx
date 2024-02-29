import { pgClient } from '@r6index/db/client';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, defer, json } from '@remix-run/cloudflare';
import { Await, ShouldRevalidateFunction, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { ValiError, object, parse, string, uuid, value } from 'valibot';
import { PlayerError } from '~/components/player/player-error';
import { PlayerLoadingSkeleton } from '~/components/player/player-loading-skeleton';
import { PlayerMaps } from '~/components/player/player-maps';
import { PlayerNavigation } from '~/components/player/player-navigation';
import { PlayerNotExist } from '~/components/player/player-not-exist';
import { PlayerOperators } from '~/components/player/player-operators';
import { PlayerSimilarPlayers } from '~/components/player/player-similar-players';
import { PlayerStatistics } from '~/components/player/player-statistics';
import { PlayerTrends } from '~/components/player/player-trends';
import { PlayerUnindexed } from '~/components/player/player-unindexed';
import { PlayerWeapons } from '~/components/player/player-weapons';
import { SearchMenuDialog } from '~/components/search/search-menu-dialog';
import { Button } from '~/components/shared/Button';
import { getPlayerById } from '~/lib/players/index.server';

// only revalidate if the action was successful
export const shouldRevalidate: ShouldRevalidateFunction = ({ actionResult, currentParams, nextParams }) => {
	console.log(actionResult, currentParams, nextParams);
	if (currentParams.id === nextParams.id && !actionResult.ok) {
		return false;
	}

	return true;
};

//TODO: handle player data (issue with remix and using deferred data in a meta function)
export const meta: MetaFunction = () => {
	return [{ title: 'R6 Index: Player' }];
};

const idSchema = string([uuid()]);

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
	const { id } = params;
	const env = context.cloudflare.env;

	try {
		// valid id param
		const parsedId = parse(idSchema, id);

		// fetch player from db
		const dbClient = await pgClient(env.SUPABASE_URL);
		const player = getPlayerById(parsedId, dbClient, env);

		return defer({ data: player });
	} catch (error) {
		console.error(error);
		const isValiError = error instanceof ValiError;
		throw new Response(isValiError ? 'Error' : 'Oh no! Something went wrong!', {
			status: isValiError ? 500 : 400,
		});
	}
};

const indexSchema = object({
	intent: string([value('index')]),
	id: string([uuid()]),
	honeypot: string([value('')]),
});

export const action = async ({ request, context, params }: ActionFunctionArgs) => {
	const { id } = params;
	const env = context.cloudflare.env;
	const formData = await request.formData();

	try {
		const indexDetails = parse(indexSchema, {
			honeypot: String(formData.get('id')),
			id: id,
			intent: String(formData.get('intent')),
		});

		const dbClient = await pgClient(env.SUPABASE_URL);
		await getPlayerById(indexDetails.id, dbClient, env, true);

		return json({ ok: true });
	} catch (error) {
		if (error instanceof ValiError) {
			console.error(error);
			return json({ data: null, error: error.message, ok: false }, { status: 400 });
		}
	}
};

export default function Player() {
	const { data } = useLoaderData<typeof loader>();

	return (
		<>
			<Suspense fallback={<PlayerLoadingSkeleton />}>
				<Await resolve={data}>
					{(data) => {
						if (!data) {
							return <PlayerNotExist />;
						}

						return (
							<>
								<header className='fixed top-0 left-0 w-dvw bg-accent-1 z-50 px-4 lg:px-20'>
									<div className='relative flex flex-col w-full max-w-6xl mx-auto before:absolute before:-bottom-6 before:left-0 before:h-6 before:w-3 before:overflow-hidden before:shadow-[#101211_0px_-12px_0px_0px] before:rounded-tl-xl after:absolute after:-bottom-6 after:right-0 after:h-6 after:w-3 after:shadow-[#101211_0px_-12px_0px_0px] after:rounded-tr-xl'>
										<div
											style={{
												background:
													'radial-gradient(50% 2.15168e+07% at 50% 348.84%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%)',
											}}
											className='absolute bottom-0 left-0 w-full h-[2px]'
										/>
										<div className='flex py-4 justify-between items-center w-full'>
											<div className='flex items-center gap-4'>
												<SearchMenuDialog defaultValue={data.name}>
													{(handlePress) => (
														<Button
															className={'flex items-center gap-1 px-2.5 py-1.5 text-sm'}
															onPress={() => handlePress(true)}
														>
															<svg
																xmlns='http://www.w3.org/2000/svg'
																viewBox='0 0 24 24'
																width='16'
																height='16'
																fill='none'
																stroke='currentColor'
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth='2'
															>
																<title>Search Icon</title>
																<path d='m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z' />
															</svg>
															<span className='pr-1 text-sm'>Search</span>
														</Button>
													)}
												</SearchMenuDialog>
											</div>
											<div className='flex items-center gap-4'>
												{data.indexed && (
													<PlayerNavigation
														// @ts-ignore
														disabledKeys={[
															!data.trends && 'overview',
															(!data.ranked || !data.summary) && 'statistics',
															!data.operators && 'operators',
															!data.maps && 'maps',
															!data.weapons && 'weapons',
														]}
													/>
												)}

												<Button className={'size-8 flex justify-center items-center p-0'}>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														viewBox='0 0 24 24'
														width='16'
														height='16'
														fill='none'
														stroke='currentColor'
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='2'
													>
														<title>Bookmark Icon</title>
														<path d='M5 9c0-1.861 0-2.792.245-3.545a5 5 0 0 1 3.21-3.21C9.208 2 10.139 2 12 2s2.792 0 3.545.245a5 5 0 0 1 3.21 3.21C19 6.208 19 7.139 19 9v13l-1.794-1.537c-1.848-1.584-2.771-2.376-3.808-2.678a5 5 0 0 0-2.796 0c-1.037.302-1.96 1.094-3.808 2.678L5 22V9Z' />
													</svg>
												</Button>
											</div>
										</div>
										<div className='flex py-4 justify-between items-center w-full'>
											<div className='flex gap-4 items-center'>
												<div className='relative bg-gray-50 size-8 overflow-hidden rounded-lg aspect-square'>
													<img
														className='absolute top-0 left-0 w-full h-full object-cover'
														src={`https://ubisoft-avatars.akamaized.net/${data.id}/default_146_146.png`}
														alt={`${data.name} Profile`}
														sizes='33vw'
													/>
												</div>
												<h1 className='uppercase text-sm text-accent-12 font-medium'>{data.name}</h1>
												<span className='uppercase text-sm text-accent-11 -ml-2'>{data.platform}</span>
											</div>
											{!data.indexed && (
												<div className='flex gap-2'>
													{data.level && (
														<div className='text-sm bg-accent-3 border-[0.5px] border-accent-7 px-2.5 py-1.5 rounded-lg'>
															<span className='text-accent-11'>LEVEL</span>{' '}
															<span className='uppercase text-accent-12'>{data.level.level}</span>
														</div>
													)}
													{data.ranked && (
														<>
															<div className='text-sm bg-accent-3 border-[0.5px] border-accent-7 px-2.5 py-1.5 rounded-lg'>
																<span className='text-accent-11'>K/D</span>{' '}
																<span className='uppercase text-accent-12'>{data.ranked.kdRatio.toFixed(2)}</span>
															</div>
															<div className='text-sm bg-accent-3 border-[0.5px] border-accent-7 px-2.5 py-1.5 rounded-lg'>
																<span className='text-accent-11'>RANK</span>{' '}
																<span className='uppercase text-accent-12'>{data.ranked.rankText}</span>
															</div>
														</>
													)}
												</div>
											)}
											{data.indexed && <PlayerSimilarPlayers data={data.similar} />}
										</div>
									</div>
								</header>
								<main className='relative bg-accent-1 min-h-[calc(100dvh-(130px+80px))] overflow-hidden px-4 lg:px-20'>
									<div className='relative min-h-[calc(100dvh-(130px+80px))] mt-[130px] max-w-6xl w-full px-8 lg:px-20 xl:px-40 mx-auto bg-accent-2 shadow-xl flex flex-col rounded-xl'>
										{!data.indexed && <PlayerUnindexed />}
										{data.indexed && (
											<div className='flex flex-col pt-10 lg:pt-20 gap-20'>
												{data.trends && <PlayerTrends trends={data.trends} />}
												{data.ranked && data.summary && data.summary.all && (
													<PlayerStatistics name={data?.name} ranked={data.ranked} summary={data.summary.all} />
												)}
												{data.operators && <PlayerOperators user={data?.id} operators={data.operators} />}
												{data.maps && <PlayerMaps user={data?.id} maps={data.maps} />}
												{data.weapons && <PlayerWeapons user={data?.id} weapons={data.weapons} />}
											</div>
										)}
									</div>
								</main>
								<footer className='h-20 bg-accent-1'>
									<div className='flex w-full h-full items-center justify-center mx-auto max-w-6xl'>
										<span className='text-xs text-accent-7'>
											© 2024 R6 Index. Rainbow Six Siege is a registered trademark of Ubisoft.
										</span>
									</div>
								</footer>
							</>
						);
					}}
				</Await>
			</Suspense>
		</>
	);
}

export function ErrorBoundary() {
	return <PlayerError />;
}
