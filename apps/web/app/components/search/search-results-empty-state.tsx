import { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

interface PropsWithRippleEffect extends Props {
	showRippleEffect?: boolean;
}

const Container = ({ children, showRippleEffect }: PropsWithRippleEffect) => {
	return (
		<div className='relative flex flex-col w-full gap-4 h-[50dvh] lg:h-[30dvh] p-2 items-center justify-center rounded-lg border border-accent-7 overflow-hidden'>
			{showRippleEffect && (
				<div className='absolute left-1/2 top-[36%] lg:top-[30%] h-full w-full overflow-visible z-0'>
					<div
						className='absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-accent-3'
						style={{
							width: '20dvw',
							height: '20dvw',
							opacity: 0.25,
							animationDelay: '0',
						}}
					/>
					<div
						className='absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-accent-3'
						style={{
							width: '30dvw',
							height: '30dvw',
							opacity: 0.21,
							animationDelay: '0.06s',
						}}
					/>
					<div
						className='absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-accent-3'
						style={{
							width: '40dvw',
							height: '40dvw',
							opacity: 0.18,
							animationDelay: '0.12s',
						}}
					/>
					<div
						className='absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-accent-3'
						style={{
							width: '50dvw',
							height: '50dvw',
							opacity: 0.15,
							animationDelay: '0.18s',
						}}
					/>
					<div
						className='absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-accent-3'
						style={{
							width: '60dvw',
							height: '60dvw',
							opacity: 0.12,
							animationDelay: '0.24s',
						}}
					/>
					<div
						className='absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-accent-3'
						style={{
							width: '70dvw',
							height: '70dvw',
							opacity: 0.09,
							animationDelay: '0.3s',
						}}
					/>
					<div
						className='absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-accent-3'
						style={{
							width: '80dvw',
							height: '80dvw',
							opacity: 0.06,
							animationDelay: '0.36s',
						}}
					/>
				</div>
			)}
			{children}
		</div>
	);
};

const Icon = ({ children }: Props) => {
	return (
		<div className='rounded-lg bg-accent-2 outline outline-1 shadow-2xl outline-accent-7 size-12 flex items-center justify-center z-10'>
			{children ? (
				children
			) : (
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
					className='text-accent-11'
				>
					<title>Icon</title>
					<path d='m21 21-6.05-6.05m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z' />
				</svg>
			)}
		</div>
	);
};

const Title = ({ children }: Props) => {
	return <h3 className='text-accent-12 mt-2 z-10'>{children}</h3>;
};

const Description = ({ children }: Props) => {
	return <p className='text-accent-11 -mt-3 z-10 text-center'>{children}</p>;
};

const Action = ({ children }: Props) => {
	return <div className='mx-auto z-10'>{children}</div>;
};

export const SearchResultEmptyState = {
	Container,
	Icon,
	Title,
	Description,
	Action,
};
