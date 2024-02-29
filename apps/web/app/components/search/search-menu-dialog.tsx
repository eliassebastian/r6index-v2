import { Form, useFetcher, useNavigate, useSubmit } from '@remix-run/react';
import { Command } from 'cmdk';
import { type ReactNode, useEffect, useState } from 'react';
import { DialogTrigger } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { Button } from '../shared/Button';
import { Dialog } from '../shared/Dialog';
import { Logo } from '../shared/Logo';
import { Modal } from '../shared/Modal';

interface SearchMenuItemProps {
	handleOpen: (state: boolean) => void;
	player: any;
}

const SearchMenuItem = ({ handleOpen, player }: SearchMenuItemProps) => {
	const navigate = useNavigate();

	return (
		<Command.Item
			onSelect={() => {
				navigate(`/player/${player.id}`);
				handleOpen(false);
			}}
			value={player.name}
			className='aria-selected:bg-accent-4 text-accent-11 aria-selected:text-accent-12 mt-2 p-2 rounded-[calc(8px-4px)] w-full'
		>
			<div className='flex items-center gap-2 w-full'>
				<div className='relative size-8 bg-accent-4 rounded-lg overflow-hidden'>
					<img
						src={`https://ubisoft-avatars.akamaized.net/${player.id}/default_146_146.png`}
						alt=''
						className='absolute w-full h-ful inset-0 object-cover object-center'
					/>
				</div>
				<div>
					<div className='flex gap-1 items-center text-sm'>
						<h3 className='text-accent-12'>{player.name}</h3>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 48 48'
							width='16px'
							height='16px'
							fill='#eceeed'
							aria-label='Search Icon'
						>
							<title>Search Icon</title>
							<path d='M23.078,4C15.035,4,8.071,8.224,4.449,15.298l1.741,0.85c-2.525,4.801-2.53,10.741-1.002,14.747 l0.011-0.004c0.816,2.336,2.155,4.78,4.126,6.935C11.909,40.651,16.526,44,23.898,44c0.068,0,0.136,0,0.204-0.001v0 c8.231-0.007,19.81-6.075,19.81-19.556C43.912,11.022,33.431,4,23.078,4z M8.999,29.406c-0.183,0.027-0.382,0.024-0.565,0.005 c-0.582-1.778-0.548-3.458-0.389-4.731c0.623-4.982,5.116-10.133,12.002-10.133c0.001,0,0.003,0,0.004,0 c6.842,0.001,9.828,4.313,10.919,7.552c-0.135,0.078-0.284,0.156-0.428,0.227c-0.199-0.321-0.422-0.638-0.703-0.945 c-1.171-1.276-4.458-4.256-9.837-4.08C13.733,17.472,9.247,22.505,8.999,29.406z M27.973,30.924 c-1.062,1.355-2.481,2.153-4.034,2.252c-5.635-0.035-5.801-4.642-5.801-5.17c0-2.184,1.643-5.259,5.297-5.259 c1.268,0,2.351,0.507,3.132,1.301c0.815,0.829,1.146,1.947,0.951,3.184c-0.235,1.489-1.098,2.811-1.112,2.83L27.973,30.924z M24.087,40.551c-5.828,0-11.459-4.962-11.588-10.209c-0.083-3.365,1.197-6.949,4.077-8.623c0.137,0.098,0.25,0.234,0.324,0.416 c-1.475,1.631-2.293,3.762-2.293,5.871c0,4.148,2.935,8.614,9.379,8.621c0.004,0,0.009,0,0.013,0c0.029,0,0.057-0.004,0.087-0.004 l0,0.001c0.006,0,0.013-0.002,0.019-0.002c2.86-0.027,5.435-1.112,7.453-3.155c2.298-2.324,3.596-5.646,3.475-8.885 c-0.195-5.212-4.435-13.481-14.98-13.483c-0.001,0-0.002,0-0.004,0c-4.211,0-7.692,1.445-10.323,3.609 c-0.267-0.095-0.429-0.253-0.517-0.435c3.229-4.367,8.139-6.825,13.87-6.825c8.598,0,17.303,5.837,17.303,16.995 C40.381,35.554,30.853,40.551,24.087,40.551z' />
						</svg>
					</div>
					<div className='text-accent-11 text-sm'>
						<span>Level {player.level.level}</span>
						{' • '}
						<span>{player.ranked.rankText}</span>
						{' • '}
						<span>KD {player.ranked.kdRatio.toFixed(2)}</span>
					</div>
				</div>
			</div>
		</Command.Item>
	);
};

interface Props {
	defaultValue?: string;
	children: (handleOpen: (state: boolean) => void) => ReactNode;
}

export const SearchMenuDialog = ({ children, defaultValue }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const submit = useSubmit();
	const fetcher = useFetcher();

	const handleOpen = (state: boolean) => setIsOpen(state);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				setIsOpen(true);
			}

			if (e.key === 'Escape') {
				e.preventDefault();
				setIsOpen(false);
			}
		};

		window.addEventListener('keydown', onKeyDown);
		fetcher.load('/menu');

		return () => {
			window.removeEventListener('keydown', onKeyDown);
		};
	}, []);

	useEffect(() => {
		if (!isOpen) return;
		fetcher.load('/menu');
	}, [isOpen]);

	return (
		<DialogTrigger>
			{children(handleOpen)}
			<Modal isDismissable isOpen={isOpen} onOpenChange={setIsOpen}>
				<Dialog className='top-0 left-0 w-dvw h-dvh lg:max-w-2xl lg:h-auto p-0 max-h-full lg:rounded-lg bg-accent-3 text-left align-middle text-accent-12 bg-clip-padding border-[0.5px] border-accent-7'>
					<Command className='flex flex-col h-full'>
						<div className='flex items-center p-0 border-b-[0.5px] border-accent-7'>
							<Form method='GET' action='/search' className='relative grow h-12'>
								<div
									className={twMerge(
										'absolute top-2 left-1 flex items-center justify-center size-8 text-accent-11',
										isOpen && 'hidden lg:flex',
									)}
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										width='18'
										height='18'
										fill='none'
										stroke='currentColor'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
									>
										<title>a</title>
										<path d='m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z' />
									</svg>
								</div>
								<div
									className={twMerge(
										'absolute top-2 left-1 hidden items-center justify-center size-8 text-accent-11',
										isOpen && 'flex lg:hidden',
									)}
								>
									<Button variant='icon' className={'size-8 p-0'} onPress={() => setIsOpen(false)}>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											width='18'
											height='18'
											fill='none'
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
										>
											<title>a</title>
											<path d='M8.83 6a30.23 30.23 0 0 0-5.62 5.406A.949.949 0 0 0 3 12m5.83 6a30.233 30.233 0 0 1-5.62-5.406A.949.949 0 0 1 3 12m0 0h18' />
										</svg>
									</Button>
								</div>
								<Command.Input
									className='w-full h-12 bg-accent-3 border-none pl-11 pr-2 py-2 rounded-t-lg text-accent-12 focus-visible:outline-none'
									autoFocus
									placeholder={'Search for a Player'}
									autoComplete='off'
									name='q'
									onKeyDown={(e) => {
										if (e.key === 'Enter' && e.currentTarget.value.length >= 3) {
											submit(e.currentTarget.form);
											setIsOpen(false);
										}
									}}
								/>
							</Form>
						</div>
						<Command.List className='h-[calc(100%-48.5px+48.5px)] lg:min-h-[350px] lg:max-h-[350px] overflow-auto'>
							<Command.Empty className='flex w-full h-[350px] items-center justify-center text-accent-11'>
								Begin New Search
							</Command.Empty>
							<div className='p-1'>
								<Command.Group
									className='mt-2 [&_[cmdk-group-heading]]:text-accent-11 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:ml-2 w-full'
									heading='Popular'
								>
									{fetcher.data?.popular.map((player) => (
										<SearchMenuItem key={player.id} handleOpen={handleOpen} player={player} />
									))}
								</Command.Group>
								{/* <Command.Group
                  className="[&_[cmdk-group-heading]]:text-accent-11 mt-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:ml-2"
                  heading="Bookmarked"
                >
                  <Command.Empty>No Bookmarks</Command.Empty>
                </Command.Group> */}
							</div>
						</Command.List>
						<div className='h-[48.5px] flex justify-between items-center w-full border-t-[0.5px] border-accent-7 px-2'>
							<div className=''>
								<Logo height={12} className='rounded-[3px]' />
							</div>
							<div className='flex gap-1 items-center text-sm text-accent-11'>
								Go to Player
								<kbd className='bg-accent-6 rounded-sm size-5 flex items-center justify-center'>
									<svg xmlns='http://www.w3.org/2000/svg' width='15' height='14' viewBox='0 0 25 24' fill='none'>
										<title>Enter</title>
										<path
											d='M21.5 4C21.5 3.44771 21.0523 3 20.5 3C19.9477 3 19.5 3.44772 19.5 4L19.5 7C19.5 8.41663 19.4992 9.41896 19.4352 10.2026C19.3721 10.9745 19.2527 11.4457 19.064 11.816C18.6805 12.5686 18.0686 13.1805 17.316 13.564C16.9457 13.7527 16.4745 13.8721 15.7026 13.9352C14.919 13.9992 13.9166 14 12.5 14L9.87309 14C9.90217 13.3317 9.96041 12.6644 10.0478 12C10.1062 11.5567 10.1824 11.1114 10.3442 10.1693C10.4134 9.76678 10.2308 9.36271 9.8831 9.14855C9.53539 8.93438 9.09239 8.95316 8.76406 9.19598C6.94203 10.5435 5.30519 12.1179 3.89411 13.8796C3.63266 14.206 3.5 14.6025 3.5 15C3.5 15.3975 3.63266 15.794 3.89411 16.1204C5.30519 17.8821 6.94203 19.4565 8.76406 20.804C9.0924 21.0468 9.53539 21.0656 9.8831 20.8515C10.2308 20.6373 10.4134 20.2332 10.3442 19.8307C10.1824 18.8885 10.1062 18.4433 10.0478 18C9.96042 17.3356 9.90217 16.6683 9.87309 16L12.5437 16C13.9068 16 14.9908 16 15.8654 15.9286C16.761 15.8554 17.5247 15.7023 18.2239 15.346C19.3529 14.7708 20.2708 13.8529 20.846 12.7239C21.2023 12.0247 21.3554 11.261 21.4286 10.3654C21.5 9.49086 21.5 8.40687 21.5 7.04387L21.5 4Z'
											fill='currentcolor'
										/>
									</svg>
								</kbd>
							</div>
						</div>
					</Command>
				</Dialog>
			</Modal>
		</DialogTrigger>
	);
};
