import type { PlayerFullTextSearch } from '@r6index/shared-types/players';
import { GridListItem } from 'react-aria-components';
import { timeAgo } from '~/utils/date';

interface Props {
	player: PlayerFullTextSearch;
}

export const SearchResultItem = ({ player }: Props) => {
	return (
		<GridListItem
			key={player.id}
			textValue={player.id}
			href={`player/${player.id}`}
			className={
				'w-full flex bg-accent-2 hover:bg-accent-3 border border-accent-7 transition-colors hover:border-accent-8  rounded-lg flex-row gap-5 p-3 sm:p-4 group relative z-[1] items-center sm:items-start outline-0 focus-visible:outline-2 outline outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight] outline-offset-2'
			}
		>
			<div className='relative size-16 overflow-hidden rounded-md flex-shrink-[0] aspect-square'>
				<img
					className='w-full h-full object-cover'
					src={`https://ubisoft-avatars.akamaized.net/${player.id}/default_146_146.png`}
					alt={`${player.name} profile`}
				/>
			</div>
			<div className='flex flex-col gap-1 overflow-hidden text-accent-11'>
				<div className='flex'>
					<h3 className='text-accent-12'>{player.name}</h3>
				</div>
				<p className='text-xs'>Last Seen {timeAgo(player.lastSeenAt)}</p>
				<p className='text-xs'>
					Level {player.level.level} · {player.ranked.rankText}
					{player.ranked.kdRatio !== 0 && <span> · {player.ranked.kdRatio.toFixed(2)} K/D</span>}
				</p>
			</div>
		</GridListItem>
	);
};
