import { Link } from '@remix-run/react';
import { SearchMenuDialog } from '../search/search-menu-dialog';
import { Button } from '../shared/Button';
import { ErrorLayout } from '../shared/ErrorLayout';
import { Logo } from '../shared/Logo';

export const PlayerNotExist = () => {
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
							<path d='M11 15H7a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7m9-8-2.5 2.5m0 0L16 18m2.5-2.5L21 18m-2.5-2.5L16 13m-1-6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z' />
						</svg>
					</div>
					<h2 className='text-xl text-accent-12 mt-8'>Sorry, Player Not Found!</h2>
					<p className='text-accent-11 text-lg text-center max-w-[80%] md:max-w-md mt-2'>
						The player you're looking for does not exist. Due to issues out of our control, we currently only support
						players on PC.
					</p>
				</div>
				{/* <h1>Player not found</h1> */}
			</ErrorLayout.Body>
			<ErrorLayout.Footer />
		</ErrorLayout.Page>
	);
};
