export const PlayerTableLoadingSkeleton = () => {
	return (
		<div className='min-h-dvh w-full max-w-6xl mx-auto px-4 py-4 lg:py-16'>
			<div className='h-10'>
				<div className='bg-accent-2 rounded-lg h-full w-32 animate-pulse' />
			</div>
			<div className='bg-accent-2 rounded-lg h-[50dvh] animate-pulse mt-10' />
		</div>
	);
};
