import type { PlayerMapStats, PlayerTrendSide } from '@r6index/shared-types/players';
import { useState } from 'react';
import { useMemo } from 'react';
import { calculateBestMap, generateMapRecap, normaliseMapTitle } from '~/lib/maps';
import { AnimatedTab, AnimatedTabList, AnimatedTabs } from '../shared/AnimatedTabs';
import { Link } from '../shared/Button';
import { PlayerMapsSunburstChart } from './player-maps-sunburst-chart';

interface Props {
	user: string;
	maps: PlayerMapStats;
}

export const PlayerMaps = ({ user, maps }: Props) => {
	const [side, setSide] = useState<PlayerTrendSide>('all');
	const topDefenderMap = useMemo(() => calculateBestMap(maps.defender), [maps]);
	const topAttackerMap = useMemo(() => calculateBestMap(maps.attacker), [maps]);

	return (
		<section id={'maps'} className='last:pb-10'>
			<div className='flex justify-between items-center'>
				<h2 className='text-accent-11'>Maps</h2>
				<Link href={`/player/${user}/maps`} className={'flex items-center gap-1 px-2.5 py-1.5 text-sm'}>
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
						<title>View All Icon</title>
						<path d='M9 4.236v13m6-10.472v13M10.431 4.716l3.153 1.576c.51.255.765.383 1.032.435a2 2 0 0 0 .768 0c.267-.052.522-.18 1.032-.435 1.491-.746 2.237-1.118 2.843-1.039a2 2 0 0 1 1.399.864C21 6.624 21 7.457 21 9.125v5.897c0 .718 0 1.077-.11 1.394a2 2 0 0 1-.461.747c-.235.24-.556.4-1.198.721l-2.8 1.4c-.525.263-.787.394-1.062.446a2.001 2.001 0 0 1-.738 0c-.275-.052-.537-.183-1.062-.445l-3.153-1.577c-.51-.255-.765-.382-1.032-.435a2.002 2.002 0 0 0-.768 0c-.267.053-.522.18-1.032.435-1.491.746-2.237 1.118-2.843 1.04a2 2 0 0 1-1.399-.865C3 17.376 3 16.543 3 14.875V8.978c0-.718 0-1.077.11-1.394a2 2 0 0 1 .461-.747c.235-.24.556-.4 1.198-.721l2.8-1.4c.525-.263.787-.394 1.062-.446a2 2 0 0 1 .738 0c.275.052.537.183 1.062.446Z' />
					</svg>
					<span className='pr-1 text-sm mt-0.5'>View All</span>
				</Link>
			</div>
			<div className='grid grid-cols-2 grid-rows-2 gap-4 pt-10'>
				<div className='relative col-span-1 rounded-lg bg-accent-1 overflow-hidden'>
					<div
						style={{ backgroundColor: '#14a494' }}
						className={'absolute top-0 -left-10 w-[50%] h-[50%] blur-[70px] opacity-20 z-0'}
					/>
					<div
						style={{ backgroundColor: '#14a494' }}
						className={'absolute top-1/2 left-[30%] w-[30%] h-[30%] blur-[70px] opacity-10 z-0'}
					/>
					<div className='flex flex-col h-full p-6 z-10'>
						<div className='grow flex-1'>
							<div className='rounded-full bg-white/5 w-fit py-1 px-2.5'>
								<h2 className='text-sm text-accent-12'>
									Top Attacking Map - {normaliseMapTitle(topAttackerMap.name, true)}
								</h2>
							</div>
						</div>
						<div className='text-sm text-accent-12'>
							<h3 className='text-xs text-accent-11'>Overview</h3>
							<p>{generateMapRecap(topAttackerMap)}</p>
						</div>
					</div>
				</div>
				<div className='col-span-1 row-span-2 p-4'>
					<h3 className='text-accent-11 text-center pb-4'>Breakdown</h3>
					<div className='h-[300px]'>
						<PlayerMapsSunburstChart rawData={maps[side]} />
					</div>
					<div className='mt-6 relative flex justify-center before:absolute before:h-[0.5px] before:w-full before:top-0 before:left-0 before:bg-accent-5'>
						<div className={'relative pt-2'}>
							<AnimatedTabs defaultSelectedKey={side} onSelectionChange={(key) => setSide(key as PlayerTrendSide)}>
								<AnimatedTabList>
									<AnimatedTab id='all'>All</AnimatedTab>
									<AnimatedTab id='attacker'>Attacker</AnimatedTab>
									<AnimatedTab id='defender'>Defender</AnimatedTab>
								</AnimatedTabList>
							</AnimatedTabs>
						</div>
					</div>
				</div>
				<div className='relative col-span-1 bg-accent-1 rounded-lg overflow-hidden'>
					<div
						style={{ backgroundColor: '#ac7e58' }}
						className={'absolute bottom-0 -left-10 w-[50%] h-[50%] blur-[70px] opacity-20 z-0'}
					/>
					<div
						style={{ backgroundColor: '#ac7e58' }}
						className={'absolute bottom-1/2 left-[30%] w-[30%] h-[30%] blur-[70px] opacity-10 z-0'}
					/>
					<div className='flex flex-col h-full p-6 z-10'>
						<div className='grow flex-1'>
							<div className='rounded-full bg-white/5 w-fit py-1 px-2.5'>
								<h2 className='text-sm text-accent-12'>
									Top Defending Map - {normaliseMapTitle(topDefenderMap.name, true)}
								</h2>
							</div>
						</div>
						<div className='text-sm text-accent-12'>
							<h3 className='text-xs text-accent-11'>Overview</h3>
							<p>{generateMapRecap(topDefenderMap)}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
