import { UbisoftWeaponsConfig } from '@r6index/configs/weapons';
import type { PlayerWeaponStats } from '@r6index/shared-types/players';
import { useMemo } from 'react';
import { calculateTopWeapons } from '~/lib/weapons';
import { Link } from '../shared/Button';

interface Props {
	user: string;
	weapons: PlayerWeaponStats;
}

export const PlayerWeapons = ({ user, weapons }: Props) => {
	const top3Weapons = useMemo(() => calculateTopWeapons(weapons.all, 3), []);

	return (
		<section id='weapons' className='last:pb-10'>
			<div className='flex justify-between items-center'>
				<h2 className='text-accent-11'>Weapons</h2>
				<Link href={`/player/${user}/weapons`} className={'flex items-center gap-1 px-2.5 py-1.5 text-sm'}>
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
						<title>View All Icon</title>
						<path d='M15.996 6.494a4 4 0 1 0-5.916 3.512l-4.084 7.488m9.851 3.361a4 4 0 1 0 .244-6.876L12 6.495m-7.928 7.5a4 4 0 1 0 5.92 3.507l8.528-.008' />
					</svg>
					<span className='pr-1 text-sm mt-0.5'>View All</span>
				</Link>
			</div>
			<div className='grid grid-rows-3 gap-4 mt-10'>
				{top3Weapons.map((weapon) => (
					<div key={weapon.weaponName} className='flex justify-between bg-accent-1 rounded-lg p-6 text-sm items-center'>
						<div className='flex items-center'>
							<div className='w-[100px]'>
								<img
									src={`https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/${
										UbisoftWeaponsConfig[weapon.weaponName].icon_url
									}`}
									alt={`${UbisoftWeaponsConfig[weapon.weaponName]} icon`}
								/>
							</div>
							<div className='flex-grow pl-4'>
								<h3 className='text-accent-12'>{weapon.weaponName}</h3>
								<p className='text-accent-11'>{weapon.weaponType}</p>
							</div>
						</div>
						<div className='flex gap-14 items-center'>
							<div className='flex'>
								<div className='grid grid-rows-2 text-sm gap-0.5'>
									<div className='rounded-t-lg bg-accent-7 text-accent-12 px-2 text-center'>{weapon.kills}</div>
									<div className='rounded-b-lg bg-accent-5 text-accent-11 text-center px-2'>{weapon.headshots}</div>
								</div>
								<div className='grid grid-rows-2 text-sm gap-0.5'>
									<span className='ml-1 text-accent-11'>Kills</span>
									<span className='ml-1 text-accent-11'>Headshots</span>
								</div>
							</div>
							<div className='flex'>
								<div className='grid grid-rows-2 text-sm gap-0.5'>
									<span className='rounded-t-lg bg-accent-7 text-accent-12 px-2 text-center'>{weapon.roundsWon}</span>
									<span className='rounded-b-lg bg-accent-5 text-accent-11 text-center px-2'>{weapon.roundsLost}</span>
								</div>
								<div className='grid grid-rows-2 text-sm gap-0.5'>
									<span className='ml-1 text-accent-11'>Rounds Won</span>
									<span className='ml-1 text-accent-11'>Rounds Lost</span>
								</div>
							</div>
							<div className='flex items-center gap-3'>
								<div className='relative w-[100px] h-[30px]'>
									<svg
										width='100'
										height='2'
										viewBox='0 0 100 2'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										className='absolute top-1/2 left-0 -translate-y-1/2 w-full h-full'
									>
										<title>Accuracy Icon</title>
										<path
											opacity='0.3'
											d='M0 1L100 0.999991'
											stroke='#868F97'
											strokeMiterlimit='11.4737'
											strokeDasharray='3 3'
										/>
									</svg>
									<div
										className='absolute top-[calc(50%-0.5px)] left-0 w-px h-px bg-[var(--success-8)]'
										style={{
											transform: 'translateX(20px) scaleX(40)',
											transformOrigin: 'left center',
										}}
									/>
									<div
										className='absolute top-[calc(50%-4px)] left-0 size-2 rounded-full bg-[var(--success-9)]'
										style={{
											transform: `translateX(${weapon.headshotAccuracy * 100}px)`,
										}}
									/>
								</div>
								<span className='text-accent-12'>{(weapon.headshotAccuracy * 100).toFixed(1)}%</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
