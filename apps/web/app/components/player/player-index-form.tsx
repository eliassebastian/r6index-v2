import { useFetcher, useParams } from '@remix-run/react';
import { twJoin, twMerge } from 'tailwind-merge';
import { Button } from '../shared/Button';
import { Spinner } from '../shared/Spinner';

export const PlayerIndexForm = () => {
	const params = useParams();
	const fetcher = useFetcher({ key: params.id });
	const isIndexing = fetcher.state !== 'idle';

	return (
		<fetcher.Form method='post'>
			<input type='hidden' name='intent' value={'index'} />
			<input className='sr-only' name='id' />
			<Button
				type='submit'
				isDisabled={isIndexing}
				className={twMerge(
					'mt-3 flex items-center transition-all',
					isIndexing ? '!duration-200 !delay-0' : 'duration-200 delay-200', // Delay width change after spinner disappears
				)}
			>
				<span>{isIndexing ? 'Indexing' : 'Start Indexing'}</span>
				<div
					className={twJoin(
						'relative h-6 ml-0 transition-width duration-200', // Control width transition separately
						isIndexing ? '!w-6 !ml-4' : 'w-0 delay-150', // Delay width shrinking until after spinner fades
					)}
				>
					<div
						className={twJoin(
							'absolute w-full h-full transition-opacity',
							isIndexing ? '!opacity-100 duration-200' : 'opacity-0 duration-150 delay-0', // Ensure spinner fades out first without delay
						)}
					>
						<Spinner />
					</div>
				</div>
			</Button>
		</fetcher.Form>
	);
};
