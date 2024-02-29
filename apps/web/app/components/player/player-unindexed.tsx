import { PlayerIndexForm } from './player-index-form';

export const PlayerUnindexed = () => {
	return (
		<section className='h-[calc(100dvh-(130px+80px))]'>
			<div className='h-full flex flex-col gap-3 w-full items-center justify-center'>
				<h3 className='text-accent-12'>Oops! This player is not yet indexed.</h3>
				<p className='text-accent-11 text-center lg:max-w-[40%]'>
					To enhance our database and help the community, you can start the indexing process.
				</p>
				<PlayerIndexForm />
			</div>
		</section>
	);
};
