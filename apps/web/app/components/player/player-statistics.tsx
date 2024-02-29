import { UbisoftRankedConfig } from '@r6index/configs/ranked';
import type { PlayerRankedStats, PlayerSummaryStat } from '@r6index/shared-types/players';
import { Fragment } from 'react';

function generateRecap(playerStats: any) {
	const { rank, maxRank, rankPoints, maxRankPoints, topRankPosition } = playerStats;

	const recapPoints = [];

	if (rank === 36 && topRankPosition !== 0) {
		recapPoints.push(`Currently top ${topRankPosition} ranked player.`);
	}

	if (rank < maxRank) {
		recapPoints.push(`Peaked at ${UbisoftRankedConfig[maxRank].name}.`);
	}

	// Find the current and neighboring ranks
	const currentRank = UbisoftRankedConfig[rank];
	const nextRank = UbisoftRankedConfig[rank + 1];
	const prevRank = UbisoftRankedConfig[rank - 1];

	// Check for potential derank
	if (rank > 1 && rankPoints - currentRank.min < 100) {
		recapPoints.push(`About to Derank to ${prevRank.name}.`);
	}

	// Check for potential promotion
	if (rank < 36 && currentRank.max - rankPoints < 100) {
		recapPoints.push(`About to get promoted to ${nextRank.name}.`);
	}

	// Convert recap points to JSX with line breaks
	const recapJSX = recapPoints.map((point, index) => (
		<Fragment key={index}>
			{point}
			{index < recapPoints.length - 1 && <br />}
		</Fragment>
	));

	return recapJSX;
}

interface Props {
	name: string;
	summary: PlayerSummaryStat;
	ranked: PlayerRankedStats;
}

export const PlayerStatistics = ({ name, summary, ranked }: Props) => {
	const rankedColor = UbisoftRankedConfig[ranked.rank].color;

	return (
		<section id='statistics' className='last:pb-10'>
			<h2 className='text-accent-11'>Statistics</h2>
			<div className='grid grid-cols-3 gap-4 mt-10'>
				<div className='relative col-span-2 bg-accent-1 rounded-lg overflow-hidden'>
					<div
						style={{ backgroundColor: rankedColor }}
						className={'absolute top-0 -left-10 w-[50%] h-[50%] blur-[70px] opacity-20 z-0'}
					/>
					<div
						style={{ backgroundColor: rankedColor }}
						className={'absolute top-1/2 left-[30%] w-[30%] h-[30%] blur-[70px] opacity-10 z-0'}
					/>
					<div className='flex flex-col h-full p-6 z-10'>
						<div className='grow flex-1'>
							<div className='rounded-full bg-white/5 w-fit py-1 px-2.5'>
								<h2 className='text-sm text-accent-12'>
									{name} is {ranked.rankText}
								</h2>
							</div>
						</div>
						<div className='text-sm text-accent-12'>
							<h3 className='text-xs text-accent-11'>Recap</h3>
							{generateRecap(ranked)}
						</div>
					</div>
				</div>
				<div className='bg-accent-1 rounded-lg p-6 text-sm'>
					<div className='flex border-b border-accent-6 pb-2'>
						<h3 className='grow text-accent-11'>Rank</h3>
						<p className='text-accent-12'>{ranked.rankText}</p>
					</div>
					<div className='flex border-b border-accent-6 py-2'>
						<h3 className='grow text-accent-11'>Peak Rank</h3>
						<p className='text-accent-12'>{ranked.maxRankText}</p>
					</div>
					<div className='flex border-b border-accent-6 py-2'>
						<h3 className='grow text-accent-11'>Wins</h3>
						<p className='text-accent-12'>{ranked.wins}</p>
					</div>
					<div className='flex border-b border-accent-6 py-2'>
						<h3 className='grow text-accent-11'>Losses</h3>
						<p className='text-accent-12'>{ranked.losses}</p>
					</div>
					<div className='flex pt-2'>
						<h3 className='grow text-accent-11'>W/L Ratio</h3>
						<p className='text-accent-12'>{ranked.winLoseRatio.toFixed(2)}</p>
					</div>
				</div>
				<div className='bg-accent-1 rounded-lg p-6 text-sm'>
					<div className='flex border-b border-accent-6 pb-2'>
						<h3 className='grow text-accent-11'>Kills</h3>
						<p className='text-accent-12'>{ranked.kills}</p>
					</div>
					<div className='flex border-b border-accent-6 py-2'>
						<h3 className='grow text-accent-11'>Deaths</h3>
						<p className='text-accent-12'>{ranked.deaths}</p>
					</div>
					<div className='flex border-b border-accent-6 py-2'>
						<h3 className='grow text-accent-11'>K/D Ratio</h3>
						<p className='text-accent-12'>{ranked.kdRatio.toFixed(2)}</p>
					</div>
					<div className='flex pt-2'>
						<h3 className='grow text-accent-11'>Headshot Acc.</h3>
						<p className='text-accent-12'>{`${(summary.headshotAccuracy * 100).toFixed(1)}%`}</p>
					</div>
				</div>
				<div className='bg-accent-1 rounded-lg p-6 text-sm'>
					<div className='flex border-b border-accent-6 pb-2'>
						<h3 className='grow text-accent-11'>KOST</h3>
						<p className='text-accent-12'>{summary.roundsWithKOST.toFixed(2)}</p>
					</div>
					<div className='flex border-b border-accent-6 py-2'>
						<h3 className='grow text-accent-11'>Rounds w/ Kill</h3>
						<p className='text-accent-12'>{`${(summary.roundsWithAKill * 100).toFixed(1)}%`}</p>
					</div>
					<div className='flex border-b border-accent-6 py-2'>
						<h3 className='grow text-accent-11'>Kills per Round</h3>
						<p className='text-accent-12'>{summary.killsPerRound.toFixed(2)}</p>
					</div>
					<div className='flex pt-2'>
						<h3 className='grow text-accent-11'>Multi-kill Rate</h3>
						<p className='text-accent-12'>{`${(summary.roundsWithMultiKill * 100).toFixed(1)}%`}</p>
					</div>
				</div>
				<div className='bg-accent-1 rounded-lg p-6 text-sm'>
					<div className='flex border-b border-accent-6 pb-2'>
						<h3 className='grow text-accent-11'>Opening Kills</h3>
						<p className='text-accent-12'>{`${(summary.roundsWithOpeningKill * 100).toFixed(1)}%`}</p>
					</div>
					<div className='flex border-b border-accent-6 py-2'>
						<h3 className='grow text-accent-11'>Opening Death</h3>
						<p className='text-accent-12'>{`${(summary.roundsWithOpeningDeath * 100).toFixed(1)}%`}</p>
					</div>
					<div className='flex border-b border-accent-6 py-2'>
						<h3 className='grow text-accent-11'>Clutch Rate</h3>
						<p className='text-accent-12'>{`${(summary.roundsWithClutch * 100).toFixed(1)}%`}</p>
					</div>
					<div className='flex pt-2'>
						<h3 className='grow text-accent-11'>Survival Rate</h3>
						<p className='text-accent-12'>{`${(summary.roundsSurvived * 100).toFixed(1)}%`}</p>
					</div>
				</div>
			</div>
		</section>
	);
};
