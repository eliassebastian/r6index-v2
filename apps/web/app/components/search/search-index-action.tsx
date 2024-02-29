import { Form } from '@remix-run/react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../shared/Button';

interface Props {
	className?: string;
	showImage?: boolean;
}

export const SearchIndexAction = ({ className, showImage }: Props) => {
	return (
		<div
			className={twMerge(
				'relative w-full bg-accent-5 flex items-center rounded-lg px-4 md:pl-[100px] lg:pl-[110px] py-4 md:pr-6 border border-accent-7 z-0 my-4',
				className,
			)}
		>
			<div className='grow text-sm'>
				<h3 className='text-accent-12'>Not found the player you were looking for?</h3>
				<p className='text-accent-11 hidden md:block'>The player may not be indexed by R6 Index yet.</p>
			</div>
			<Form className='z-50' method='post'>
				<input name='user' className='sr-only' />
				<input type='hidden' name='intent' value='force-search' />
				<Button variant='secondary' type='submit'>
					Force Search
				</Button>
			</Form>
			{showImage && (
				<img
					src='/static/homeaction.png'
					alt='R6Index Logo'
					className='hidden md:block md:w-[80px] lg:w-[80px] absolute bottom-px left-2 lg:left-4 z-[999]'
				/>
			)}
			<div
				style={{
					// @ts-expect-error - css variables are not recognised by typescript
					'--size': 125,
					'--duration': 10,
					'--anchor': 90,
					'--border-width': 1.5,
					'--color-from': '#444947',
					'--color-to': '#adb5b2',
					'--delay': '-9s',
				}}
				className='absolute -inset-px rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]'
			/>
		</div>
	);
};
