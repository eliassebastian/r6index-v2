export const PlayerLoadingSkeleton = () => {
	return (
		<div className='flex flex-col'>
			<header className='fixed top-0 left-0 h-40 w-full z-50 px-4 lg:px-20'>
				<div className='h-20 flex justify-between items-center max-w-6xl mx-auto'>
					<div className='flex items-center gap-4'>
						<div className='bg-accent-2 size-8 animate-pulse rounded-lg' />
						<div className='bg-accent-2 animate-pulse h-8 w-16 rounded-lg' />
					</div>
					<div className='bg-accent-2 h-8 w-40 animate-pulse rounded-lg' />
				</div>
				<div className='h-20 flex justify-between items-center max-w-6xl mx-auto'>
					<div className='flex gap-4 items-center'>
						<div className='size-8 bg-accent-2 rounded-lg animate-pulse' />
						<div className='h-8 w-20 bg-accent-2 animate-pulse rounded-lg' />
					</div>
					<div className='flex gap-4 items-center'>
						<div className='h-8 w-8 bg-accent-2 animate-pulse rounded-lg' />
						<div className='h-8 w-8 bg-accent-2 animate-pulse rounded-lg' />
						<div className='h-8 w-8 bg-accent-2 animate-pulse rounded-lg' />
					</div>
				</div>
			</header>
			<main className='relative bg-accent-1 min-h-[calc(100dvh-15rem)] px-4 lg:px-20'>
				<div className='relative min-h-[calc(100dvh-15rem)] mt-40 max-w-6xl w-full px-8 lg:px-20 xl:px-40 mx-auto bg-accent-2 shadow-xl rounded-xl animate-pulse' />
			</main>
		</div>
	);
};
