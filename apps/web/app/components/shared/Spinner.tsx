export const Spinner = () => {
	return (
		<div className={'relative flex size-6'}>
			<i
				className={
					'absolute w-full h-full rounded-full border-2 border-solid border-t-transparent border-l-transparent border-r-transparent animate-spinner-ease-spin'
				}
			/>
			<i
				className={
					'absolute w-full h-full rounded-full opacity-75 border-dotted border-2 border-t-transparent border-l-transparent border-r-transparent animate-spinner-linear-spin'
				}
			/>
		</div>
	);
};
