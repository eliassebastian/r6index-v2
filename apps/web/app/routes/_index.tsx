import type { MetaFunction } from '@remix-run/cloudflare';
import { SearchMenuDialog } from '~/components/search/search-menu-dialog';
import { Button, Link } from '~/components/shared/Button';
import { Logo } from '~/components/shared/Logo';

export const meta: MetaFunction = () => {
	return [
		{ title: 'R6 Index' },
		{
			name: 'description',
			content: 'R6 Index: Rainbow Six Siege Analytics and Statistics',
		},
	];
};

export default function Index() {
	return (
		<>
			<header className='fixed top-0 left-0 w-full z-10 flex justify-between items-center px-2 pt-2 lg:px-6 lg:pt-6'>
				<Logo height={20} className='px-2.5' />
				<nav>
					<ul className='flex md:gap-2 lg:gap-4 items-center'>
						<li className='hidden lg:block'>
							<SearchMenuDialog>
								{(handlePress) => (
									<Button
										className={'flex items-center justify-center h-9 px-3 uppercase'}
										onPress={() => handlePress(true)}
									>
										Search
									</Button>
								)}
							</SearchMenuDialog>
						</li>
					</ul>
				</nav>
			</header>
			<main
				className='relative h-dvh bg-accent-1'
				style={{
					backgroundImage: "url('./static/home-loader.webp')",
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<img
					src='./static/home.webp'
					alt='The operator Clash from Rainbow Six Siege looking through a damaged shield'
					className='absolute w-full h-full inset-0 object-center object-cover transition-opacity duration-300'
					ref={(img) => {
						if (img?.complete) {
							img.style.opacity = '1';
							img.style.transitionDuration = '0s';
						}
					}}
					onLoad={(img) => {
						if (img.currentTarget) {
							img.currentTarget.style.opacity = '1';
						}
					}}
					loading='lazy'
				/>
				<div className='absolute bottom-2 left-2 lg:bottom-6 lg:left-6 w-[calc(100%-16px)] pl-[100px] gap-8 md:w-max rounded-lg bg-[#c83d4a] flex items-center justify-end sm:justify-between p-2'>
					<img
						src='/static/jackal-index.webp'
						className=' absolute bottom-0 left-0 h-[80px]'
						alt='The Operator Jackal from Rainbow Six Siege'
					/>
					<div className='pb-1 hidden sm:block'>
						<span className='text-white text-sm uppercase text-left'>Looking for a Player?</span>
					</div>
					<SearchMenuDialog>
						{(handlePress) => (
							<Button
								className={
									'flex items-center justify-center rounded-[5px] min-h-9 px-3 bg-accent-12 py-2 text-accent-1 hover:bg-[#dde1e1] pressed:bg-[#dde1e1] uppercase'
								}
								onPress={() => handlePress(true)}
							>
								Begin Search
							</Button>
						)}
					</SearchMenuDialog>
				</div>
			</main>
		</>
	);
}
