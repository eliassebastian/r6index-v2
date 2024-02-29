import { pgClient } from '@r6index/db/client';
import { LoaderFunctionArgs, MetaFunction, defer } from '@remix-run/cloudflare';
import { Await, ShouldRevalidateFunction, useLoaderData } from '@remix-run/react';
import r6operators from 'r6operators';
import { Suspense } from 'react';
import { TableBody } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { ValiError, parse, string, uuid } from 'valibot';
import { PlayerDetailedPage } from '~/components/player/player-detailed-table';
import { PlayerTableLoadingSkeleton } from '~/components/player/player-table-loading-skeleton';
import { Cell, Column, Row, TableHeader } from '~/components/shared/Table';
import { OperatorsFilter } from '~/data/filters/filter-operators';
import { getPlayerById } from '~/lib/players/index.server';

//TODO: handle player data (issue with remix and using deferred data in a meta function)
export const meta: MetaFunction = () => {
	return [{ title: 'R6 Index: Player Operators' }];
};

export const shouldRevalidate: ShouldRevalidateFunction = ({ currentParams, nextParams }) => {
	if (currentParams.id === nextParams.id) {
		return false;
	}

	return true;
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
		const player = await getPlayerById(parsedId, dbClient, env);

		return defer({ data: player });
	} catch (error) {
		if (error instanceof ValiError) {
			console.error(error);
			throw new Response('Validation Error', {
				status: 500,
			});
		}

		throw new Response('Oh no! Something went wrong!', {
			status: 400,
		});
	}
};

export default function PlayerOperatorsRoute() {
	const { data } = useLoaderData<typeof loader>();

	return (
		<Suspense fallback={<PlayerTableLoadingSkeleton />}>
			<Await resolve={data}>
				{(data) => (
					<PlayerDetailedPage.Container>
						<PlayerDetailedPage.Filter data={data?.operators} config={OperatorsFilter} title='Operators'>
							{(data) => (
								<PlayerDetailedPage.Table data={data} label='operators table' defaultSortColumn='name'>
									{(data) => (
										<>
											<TableHeader className='!bg-accent-2'>
												<Column id='icon' width={40} />
												<Column className={'font-normal text-xs'} id='name' isRowHeader allowsSorting width={125}>
													Name
												</Column>
												<Column className={'font-normal text-xs'} id='side' width={125}>
													Side
												</Column>
												<Column
													className={'font-normal text-xs'}
													columnClassName={'justify-end'}
													id='kills'
													allowsSorting
													width={75}
												>
													Kills
												</Column>
												<Column
													className={'font-normal text-xs'}
													columnClassName={'justify-end'}
													id='headshots'
													allowsSorting
													width={100}
												>
													Headshots
												</Column>
												<Column
													className={'font-normal text-xs'}
													columnClassName={'justify-end'}
													id='headshotAccuracy'
													allowsSorting
													width={100}
												>
													Accuracy
												</Column>
												<Column
													className={'font-normal text-xs'}
													columnClassName={'justify-end'}
													id='roundsWon'
													allowsSorting
													width={100}
												>
													Rounds Won
												</Column>
												<Column
													className={'font-normal text-xs'}
													columnClassName={'justify-end'}
													id='roundsLost'
													allowsSorting
													width={100}
												>
													Rounds Lost
												</Column>
												<Column
													className={'font-normal text-xs'}
													columnClassName={'justify-end'}
													id='winLossRatio'
													allowsSorting
													width={100}
												>
													W/L Ratio
												</Column>
												<Column
													className={'font-normal text-xs'}
													columnClassName={'justify-end'}
													id='roundsWithAKill'
													allowsSorting
													width={125}
												>
													Rounds with a Kill
												</Column>
												<Column
													className={'font-normal text-xs'}
													columnClassName={'justify-end'}
													id='multiKills'
													allowsSorting
													width={100}
												>
													Multi Kills
												</Column>
											</TableHeader>
											<TableBody
												renderEmptyState={() => (
													<div className='px-2 py-8 flex items-center justify-center text-accent-12 text-xs'>
														No Results Found
													</div>
												)}
												items={data}
											>
												{(row) => {
													return (
														<Row
															className={
																'bg-accent-3 rounded-lg overflow-hidden text-accent-11 hover:text-accent-12 selected:bg-accent-7 hover:bg-accent-4 hover:outline-1 hover:outline-accent-8'
															}
															key={row.name}
															id={row.name}
														>
															<Cell>
																<div
																	className='size-10 mx-auto'
																	dangerouslySetInnerHTML={{
																		__html: r6operators[row.name.toLowerCase() as keyof typeof r6operators].toSVG(),
																	}}
																/>
															</Cell>
															<Cell>{row.name}</Cell>
															<Cell>
																<div className='rounded-lg bg-accent-6 w-fit px-2 py-0.5 capitalize'>
																	{row.operatorSide}
																</div>
															</Cell>
															<Cell className={'text-right'}>{row.kills}</Cell>
															<Cell className={'text-right'}>{row.headshots}</Cell>
															<Cell className={'text-right'}>
																<div
																	className={twMerge(
																		'rounded-lg bg-accent-6 w-fit px-2 py-0.5 ml-auto tabular-nums',
																		row.headshotAccuracy >= 0 &&
																			row.headshotAccuracy < 0.3 &&
																			row.kills !== 0 &&
																			'bg-[#3b121a] text-[#ec5d5e]',
																		row.headshotAccuracy >= 0.3 &&
																			row.headshotAccuracy < 0.5 &&
																			row.kills !== 0 &&
																			'bg-[#302008] text-[#ffca15]',
																		row.headshotAccuracy >= 0.5 &&
																			row.headshotAccuracy <= 0.6 &&
																			row.kills !== 0 &&
																			'bg-[#1b2a1e] text-[#70d083]',
																		row.headshotAccuracy > 0.6 && row.kills !== 0 && 'bg-[#291f43] text-[#baa7ff]',
																		row.kills === 0 && row.headshotAccuracy === 0 && 'bg-transparent',
																	)}
																>
																	{row.kills === 0 && row.headshotAccuracy === 0
																		? '-'
																		: row.headshotAccuracy.toFixed(2)}
																</div>
															</Cell>
															<Cell className={'text-right'}>{row.roundsWon}</Cell>
															<Cell className={'text-right'}>{row.roundsLost}</Cell>
															<Cell className={'text-right'}>
																<div
																	className={twMerge(
																		'rounded-lg bg-accent-6 w-fit px-2 py-0.5 ml-auto tabular-nums',
																		row.winLossRatio >= 0 &&
																			row.winLossRatio < 0.7 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#3b121a] text-[#ec5d5e]',
																		row.winLossRatio >= 0.7 &&
																			row.winLossRatio < 1 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#302008] text-[#ffca15]',
																		row.winLossRatio >= 1 &&
																			row.winLossRatio <= 4 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#1b2a1e] text-[#70d083]',
																		row.winLossRatio > 4 && row.roundsPlayed !== 0 && 'bg-[#291f43] text-[#baa7ff]',
																		row.roundsPlayed === 0 && 'bg-transparent',
																	)}
																>
																	{row.roundsPlayed === 0 ? '-' : row.winLossRatio.toFixed(2)}
																</div>
															</Cell>
															<Cell className={'text-right'}>
																<div
																	className={twMerge(
																		'rounded-lg bg-accent-6 w-fit px-2 py-0.5 ml-auto tabular-nums',
																		row.roundsWithAKill >= 0 &&
																			row.roundsWithAKill < 0.4 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#3b121a] text-[#ec5d5e]',
																		row.roundsWithAKill >= 0.4 &&
																			row.roundsWithAKill < 0.7 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#302008] text-[#ffca15]',
																		row.roundsWithAKill >= 0.7 &&
																			row.roundsWithAKill <= 1 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#1b2a1e] text-[#70d083]',
																		row.roundsWithAKill > 1 && row.roundsPlayed !== 0 && 'bg-[#291f43] text-[#baa7ff]',
																		row.roundsPlayed === 0 && 'bg-transparent',
																	)}
																>
																	{row.roundsPlayed === 0 ? '-' : row.roundsWithAKill.toFixed(2)}
																</div>
															</Cell>
															<Cell className={'text-right'}>
																<div
																	className={twMerge(
																		'rounded-lg bg-accent-6 w-fit px-2 py-0.5 ml-auto tabular-nums',
																		row.roundsWithMultiKill >= 0 &&
																			row.roundsWithMultiKill < 0.2 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#3b121a] text-[#ec5d5e]',
																		row.roundsWithMultiKill >= 0.2 &&
																			row.roundsWithMultiKill < 0.6 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#302008] text-[#ffca15]',
																		row.roundsWithMultiKill >= 0.6 &&
																			row.roundsWithMultiKill <= 1 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#1b2a1e] text-[#70d083]',
																		row.roundsWithMultiKill > 1 &&
																			row.roundsPlayed !== 0 &&
																			'bg-[#291f43] text-[#baa7ff]',
																		row.roundsPlayed === 0 && 'bg-transparent',
																	)}
																>
																	{row.roundsPlayed === 0 ? '-' : row.roundsWithMultiKill.toFixed(2)}
																</div>
															</Cell>
														</Row>
													);
												}}
											</TableBody>
										</>
									)}
								</PlayerDetailedPage.Table>
							)}
						</PlayerDetailedPage.Filter>
					</PlayerDetailedPage.Container>
				)}
			</Await>
		</Suspense>
	);
}
