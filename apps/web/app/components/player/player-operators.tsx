import { UbisoftOperatorConfig } from '@r6index/configs/operators';
import type { PlayerOperatorStats } from '@r6index/shared-types/players';
import r6operators from 'r6operators';
import { calculateBestOperator } from '~/lib/operators';
import { Link } from '../shared/Button';
import { PlayerOperatorsRadarChart } from './player-operators-chart';

const generateRadarData = (data: PlayerOperatorStats[]) => {
	const roleTallyAttackers = {
		'Anti-Entry': 0,
		'Anti-Gadget': 0,
		Intel: 0,
		Support: 0,
		Breach: 0,
		'Map Control': 0,
		'Crowd Control': 0,
		'Front Line': 0,
		Trapper: 0,
	};

	const roleTallyDefenders = {
		'Anti-Entry': 0,
		'Anti-Gadget': 0,
		Intel: 0,
		Support: 0,
		Breach: 0,
		'Map Control': 0,
		'Crowd Control': 0,
		'Front Line': 0,
		Trapper: 0,
	};

	for (const operator of data) {
		const config = UbisoftOperatorConfig[operator.name.toLowerCase()];
		if (config) {
			const tally = config.side === 'attacker' ? roleTallyAttackers : roleTallyDefenders;
			for (const role of config.roles) {
				if (tally[role as keyof typeof tally] !== undefined) {
					tally[role as keyof typeof tally] += 1;
				}
			}
		}
	}

	const radarChartDataAttackers = Object.entries(roleTallyAttackers).map(([role, tally]) => ({
		role: role,
		tally: tally,
	}));

	const radarChartDataDefenders = Object.entries(roleTallyDefenders).map(([role, tally]) => ({
		role: role,
		tally: tally,
	}));

	return {
		attackers: radarChartDataAttackers,
		defenders: radarChartDataDefenders,
	};
};

interface Props {
	user: string;
	operators: PlayerOperatorStats[];
}

export const PlayerOperators = ({ user, operators }: Props) => {
	const { attackers, defenders } = generateRadarData(operators);

	const bestAttacker = calculateBestOperator(operators.filter((o: any) => o.operatorSide === 'attacker'));

	const bestDefender = calculateBestOperator(operators.filter((o: any) => o.operatorSide === 'defender'));

	const defenderSvg = r6operators[bestDefender.name.toLowerCase() as keyof typeof r6operators].toSVG();

	const attackerSvg = r6operators[bestAttacker.name.toLowerCase() as keyof typeof r6operators].toSVG();

	return (
		<section id='operators' className='last:pb-10'>
			<div className='flex justify-between items-center'>
				<h2 className='text-accent-11'>Operators</h2>
				<Link href={`/player/${user}/operators`} className={'flex items-center gap-1 px-2.5 py-1.5 text-sm'}>
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
						<path d='M19 3c1.725.458 3 2.076 3 4s-1.275 3.541-3 4M5 3c-1.725.458-3 2.076-3 4s1.275 3.541 3 4m17.153 5.376c.53.646.847 1.473.847 2.374 0 .712-.33 1.347-.847 1.76M1.847 16A3.735 3.735 0 0 0 1 18.374c0 .712.33 1.347.847 1.76M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM7.25 21h9.5A2.25 2.25 0 0 0 19 18.75 3.75 3.75 0 0 0 15.25 15h-6.5A3.75 3.75 0 0 0 5 18.75 2.25 2.25 0 0 0 7.25 21Z' />
					</svg>
					<span className='pr-1 text-sm mt-0.5'>View All</span>
				</Link>
			</div>
			<div className='grid grid-cols-2 gap-4 pt-10'>
				<div className='bg-accent-1 rounded-lg pt-6'>
					<h3 className='text-accent-11 text-center pb-4'>Attackers</h3>
					<div className='h-[300px]'>
						<PlayerOperatorsRadarChart data={attackers} />
					</div>
				</div>
				<div className='bg-accent-1 rounded-lg pt-6'>
					<h3 className='text-accent-11 text-center pb-4'>Defenders</h3>
					<div className='h-[300px]'>
						<PlayerOperatorsRadarChart data={defenders} />
					</div>
				</div>
			</div>
			<div className='grid grid-rows-2 gap-4 mt-4'>
				<div className='flex rounded-lg px-4 py-3 gap-8 bg-accent-1 items-center justify-between'>
					<div className='flex gap-6'>
						<div className='size-10' dangerouslySetInnerHTML={{ __html: attackerSvg }} />
						<div className=' grid grid-rows-2 items-center'>
							<h4 className='text-accent-12 text-sm font-medium'>{bestAttacker.name}</h4>
							<span className='text-accent-11 text-xs'>{bestAttacker.operatorSide.toUpperCase()}</span>
						</div>
					</div>
					<div className='flex gap-20 items-center'>
						<div className='flex'>
							<div className='grid grid-rows-2 text-sm gap-0.5'>
								<div className='rounded-t-lg bg-accent-7 text-accent-12 px-2 text-center'>{bestAttacker.kills}</div>
								<div className='rounded-b-lg bg-accent-5 text-accent-11 text-center px-2'>{bestAttacker.death}</div>
							</div>
							<div className='grid grid-rows-2 text-sm gap-0.5'>
								<div className='ml-1 text-accent-11'>Kills</div>
								<div className='ml-1 text-accent-11'>Deaths</div>
							</div>
						</div>
						<div className='flex'>
							<div className='grid grid-rows-2 text-sm gap-0.5'>
								<div className='rounded-t-lg bg-accent-7 text-accent-12 px-2 text-center'>{bestAttacker.roundsWon}</div>
								<div className='rounded-b-lg bg-accent-5 text-accent-11 text-center px-2'>
									{bestAttacker.roundsLost}
								</div>
							</div>
							<div className='grid grid-rows-2 text-sm gap-0.5'>
								<div className='ml-1 text-accent-11'>Rounds Won</div>
								<div className='ml-1 text-accent-11'>Rounds Lost</div>
							</div>
						</div>
						<div>
							<span className='px-2 py-0.5 text-sm rounded-full bg-[var(--success-8)] text-[var(--success-12)]'>
								{bestAttacker.roundsWithKOST.toFixed(2)}
							</span>
							<span className='text-sm text-accent-11 ml-2'>KOST</span>
						</div>
					</div>
				</div>
				<div className='flex rounded-lg px-4 py-3 gap-8 bg-accent-1 items-center justify-between'>
					<div className='flex gap-6'>
						<div className='size-10' dangerouslySetInnerHTML={{ __html: defenderSvg }} />
						<div className=' grid grid-rows-2 items-center'>
							<h4 className='text-accent-12 text-sm font-medium'>{bestDefender.name}</h4>
							<span className='text-accent-11 text-xs'>{bestDefender.operatorSide.toUpperCase()}</span>
						</div>
					</div>
					<div className='flex gap-20 items-center'>
						<div className='flex'>
							<div className='grid grid-rows-2 text-sm gap-0.5'>
								<div className='rounded-t-lg bg-accent-7 text-accent-12 px-2 text-center'>{bestDefender.kills}</div>
								<div className='rounded-b-lg bg-accent-5 text-accent-11 text-center px-2'>{bestDefender.death}</div>
							</div>
							<div className='grid grid-rows-2 text-sm gap-0.5'>
								<div className='ml-1 text-accent-11'>Kills</div>
								<div className='ml-1 text-accent-11'>Deaths</div>
							</div>
						</div>
						<div className='flex'>
							<div className='grid grid-rows-2 text-sm gap-0.5'>
								<div className='rounded-t-lg bg-accent-7 text-accent-12 px-2 text-center'>{bestDefender.roundsWon}</div>
								<div className='rounded-b-lg bg-accent-5 text-accent-11 text-center px-2'>
									{bestDefender.roundsLost}
								</div>
							</div>
							<div className='grid grid-rows-2 text-sm gap-0.5'>
								<div className='ml-1 text-accent-11'>Rounds Won</div>
								<div className='ml-1 text-accent-11'>Rounds Lost</div>
							</div>
						</div>
						<div>
							<span className='px-2 py-0.5 text-sm rounded-full bg-[var(--success-8)] text-[var(--success-12)]'>
								{bestDefender.roundsWithKOST.toFixed(2)}
							</span>
							<span className='text-sm text-accent-11 ml-2'>KOST</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
