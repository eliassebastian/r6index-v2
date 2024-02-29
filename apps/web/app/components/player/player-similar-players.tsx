import { Link } from '../shared/Button';

interface Props {
	data: any[] | null;
}

const SimilarPlayer = ({ player }: { player: any }) => {
	return (
		<Link className={'p-0 size-8'} href={`/player/${player.id}`}>
			<div className='flex items-center'>
				<div className='relative bg-accent-2 size-8 overflow-hidden rounded-lg aspect-square'>
					<img
						loading='lazy'
						className='absolute top-0 left-0 w-full h-full object-cover'
						src={`https://ubisoft-avatars.akamaized.net/${player.id}/default_146_146.png`}
						alt={`${player.name} profile`}
					/>
				</div>
				{/* <div className="ml-3">
          <p className="text-sm font-medium text-accent-11">{player.name}</p>
          <p className="text-sm text-accent-11">{player.platform}</p>
        </div> */}
			</div>
		</Link>
	);
};

export const PlayerSimilarPlayers = ({ data }: Props) => {
	if (!data || data.length === 0) {
		return (
			<div className='bg-accent-2 h-8 px-4 flex items-center justify-center rounded-lg select-none'>
				<span className='text-accent-11 text-sm'>Calculating Similar Players...</span>
			</div>
		);
	}

	return (
		<div className='flex gap-2 items-center'>
			<span className='text-xs text-accent-11 mr-4'>Similar Players</span>
			{data.map((player) => (
				<SimilarPlayer key={player.id} player={player} />
			))}
		</div>
	);
};
