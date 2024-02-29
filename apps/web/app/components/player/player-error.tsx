import { Link } from '@remix-run/react';
import { SearchMenuDialog } from '../search/search-menu-dialog';
import { Button } from '../shared/Button';
import { ErrorLayout } from '../shared/ErrorLayout';
import { Logo } from '../shared/Logo';

export const PlayerError = () => {
	return (
		<ErrorLayout.Page>
			<ErrorLayout.Header>
				<div className='flex justify-between w-full py-4 lg:py-8'>
					<Link to={'/'}>
						<Logo />
					</Link>
					<SearchMenuDialog>
						{(handlePress) => (
							<Button className={'flex items-center gap-1 px-2.5 py-1.5 text-sm'} onPress={() => handlePress(true)}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									width='16'
									height='16'
									fill='none'
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
								>
									<title>Open Icon</title>
									<path d='m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z' />
								</svg>
								<span className='pr-1 text-sm'>Search</span>
							</Button>
						)}
					</SearchMenuDialog>
				</div>
			</ErrorLayout.Header>
			<ErrorLayout.Body>
				<div className='w-full h-full flex flex-col items-center justify-center'>
					<div className='rounded-lg bg-accent-1 outline outline-1 shadow-2xl outline-accent-7 size-12 flex items-center justify-center text-accent-11'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							width='24'
							height='24'
							fill='none'
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
						>
							<title>Error Icon</title>
							<path d='M12 13V8.938M12 16v-.001m1.236-11.747a3.152 3.152 0 0 0-2.472 0c-2.356 1.003-7.924 9.9-7.76 12.279.063.932.525 1.79 1.265 2.35 1.967 1.492 13.495 1.492 15.462 0a3.227 3.227 0 0 0 1.265-2.35c.164-2.378-5.404-11.276-7.76-12.279Z' />
						</svg>
					</div>
					<h2 className='text-xl text-accent-12 mt-8'>Sorry, an Error Occurred!</h2>
					<p className='text-accent-11 text-lg text-center max-w-[80%] md:max-w-md mt-2'>
						An error occurred while trying to fetch the player data. Our team has been notified. Please try again later.
					</p>
				</div>
			</ErrorLayout.Body>
			<ErrorLayout.Footer />
		</ErrorLayout.Page>
	);
};
