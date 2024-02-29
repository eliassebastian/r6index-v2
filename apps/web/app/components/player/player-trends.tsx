import { ResponsiveLine } from '@nivo/line';
import type { PlayerTrendKey, PlayerTrendSide, PlayerTrendStats } from '@r6index/shared-types/players';
import { useMemo, useState } from 'react';
import { AnimatedTab, AnimatedTabList, AnimatedTabs } from '../shared/AnimatedTabs';
import { Select, SelectItem } from '../shared/Select';

function getLimitedDataForNivo(stats: PlayerTrendStats, key: PlayerTrendKey, trendType: PlayerTrendSide, limit = 100) {
	const trendStat = stats[trendType];

	// Initialize min and max
	let min = 0;
	let max = 0;

	// Function to update min and max
	const updateMinMax = (value: number) => {
		if (value < min) min = value;
		if (value > max) max = value;
	};

	// Ensure the required data is present
	if (trendStat?.[key]) {
		//const movingPoint = trendStat[key].movingPoint;
		const trendsDataSeries = trendStat[key].data[0].data;
		const actualsDataSeries = trendStat[key].data[1].data;

		// Enforce limits
		const forcedLimit = Math.min(limit, trendsDataSeries.length);
		const limitedTrendsData = trendsDataSeries.slice(-forcedLimit);
		const limitedActualsData = actualsDataSeries.slice(-forcedLimit);

		// Prepare the structure for Nivo
		const data = [
			{
				id: 'trend',
				data: limitedTrendsData.map((d, i) => {
					updateMinMax(d.y);
					return {
						x: i,
						y: d.y,
					};
				}),
			},
			{
				id: 'actuals',
				data: limitedActualsData.map((d, i) => {
					updateMinMax(d.y);
					return {
						x: i,
						y: d.y,
					};
				}),
			},
		];

		return {
			data,
			min,
			max,
		};
	}

	return {
		data: [],
		min,
		max,
	};
}

interface Props {
	trends: PlayerTrendStats;
}

export const PlayerTrends = ({ trends }: Props) => {
	const [side, setSide] = useState<PlayerTrendSide>('all');
	const [statistic, setStatistic] = useState<PlayerTrendKey>('roundsWithKOST');

	const options = useMemo(() => {
		return Object.keys(trends[side]!).map((key) => ({
			label: trends[side]![key as PlayerTrendKey].name,
			value: trends[side]![key as PlayerTrendKey].id,
		}));
	}, [trends, side]);

	const dataCapped = useMemo(() => getLimitedDataForNivo(trends, statistic, side), [trends, statistic, side]);

	return (
		<section id='overview' className='last:pb-10'>
			<div className='flex justify-between items-center'>
				<div>
					<h2 className='text-accent-11'>Performance</h2>
				</div>
				<div className='flex gap-6'>
					<div>
						<div className='inline-block size-2 bg-accent-9 rounded-full mr-1' />
						<span className='text-xs text-accent-11'>Actual</span>
					</div>
					<div>
						<div className='inline-block size-2 bg-[#ad7f58] rounded-full mr-1' />
						<span className='text-xs text-accent-11'>Trend</span>
					</div>
				</div>
			</div>
			<span className='text-accent-12 text-xl'>Averaging {trends[side]![statistic].average.toFixed(2)}</span>
			<div className='rounded-lg w-full h-[300px]'>
				<ResponsiveLine
					data={dataCapped.data}
					curve='monotoneX'
					colors={['#ad7f58', '#62706b']}
					xScale={{ type: 'point' }}
					lineWidth={1}
					yScale={{
						type: 'linear',
						min: 'auto',
						max: dataCapped.max * 1.25,
					}}
					enableSlices='x'
					enableGridX={false}
					enableGridY={false}
					useMesh={true}
					enablePoints={false}
					animate={false}
				/>
			</div>
			<div className='mt-6 relative flex justify-between before:absolute before:h-[0.5px] before:w-full before:top-0 before:left-0 before:bg-accent-5'>
				<div className={'relative -left-[8px] pt-2'}>
					<AnimatedTabs defaultSelectedKey={side} onSelectionChange={(key) => setSide(key as PlayerTrendSide)}>
						<AnimatedTabList>
							<AnimatedTab id='all'>All</AnimatedTab>
							<AnimatedTab id='attacker'>Attacker</AnimatedTab>
							<AnimatedTab id='defender'>Defender</AnimatedTab>
						</AnimatedTabList>
					</AnimatedTabs>
				</div>
				<Select
					aria-label='Statistics'
					className={'w-[205px] mt-2'}
					defaultSelectedKey={statistic}
					placement='top'
					onSelectionChange={(key) => {
						setStatistic(key as PlayerTrendKey);
					}}
				>
					{options.map((option) => (
						<SelectItem
							key={option.value}
							id={option.value}
							//value={option.value}
						>
							{option.label}
						</SelectItem>
					))}
				</Select>
			</div>
		</section>
	);
};
