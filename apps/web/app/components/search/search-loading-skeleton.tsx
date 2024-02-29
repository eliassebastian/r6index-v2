export const SearchLoadingSkeleton = () => {
	return (
		<div className='overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 z-0 gap-y-4 md:gap-4 pt-4 md:py-10'>
			<div className='h-[98px] bg-accent-2 animate-pulse' />
			<div className='h-[98px] bg-accent-2 animate-pulse delay-100' />
			<div className='h-[98px] bg-accent-2 animate-pulse delay-200' />
			<div className='h-[98px] bg-accent-2 animate-pulse delay-300' />
			<div className='h-[98px] bg-accent-2 animate-pulse delay-500 hidden md:block' />
			<div className='h-[98px] bg-accent-2 animate-pulse delay-700 hidden md:block' />
		</div>
	);
};
