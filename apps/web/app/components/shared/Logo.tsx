import { twMerge } from 'tailwind-merge';

interface Props {
	className?: string;
	height?: number;
}

export const Logo = ({ className, height = 16 }: Props) => {
	const originalWidth = 164.72;
	const originalHeight = 28.001;
	const aspectRatio = originalWidth / originalHeight;
	const width = height * aspectRatio;

	return (
		<div className={twMerge('relative w-min h-min py-2 px-2 rounded-lg bg-[#c83d4a] text-accent-12', className)}>
			<h1 className='sr-only'>R6 Index</h1>
			<svg width={width} height={height} viewBox='0 0 164.72 28.001' xmlns='http://www.w3.org/2000/svg'>
				<title>R6 Index Logo</title>
				<g strokeLinecap='round' fillRule='evenodd' fill='currentColor'>
					<path
						d='M 26.44 8.2 L 19.2 8.2 L 19.2 19.8 L 26.44 19.8 A 1.036 1.036 0 0 1 27.19 20.11 A 1.31 1.31 0 0 1 27.2 20.12 Q 27.52 20.44 27.52 20.88 L 27.52 26.92 A 1.036 1.036 0 0 1 27.21 27.67 A 1.31 1.31 0 0 1 27.2 27.68 Q 26.88 28 26.44 28 L 1.08 28 A 1.036 1.036 0 0 1 0.33 27.69 A 1.31 1.31 0 0 1 0.32 27.68 Q 0 27.36 0 26.92 L 0 20.88 A 1.036 1.036 0 0 1 0.31 20.13 A 1.31 1.31 0 0 1 0.32 20.12 Q 0.64 19.8 1.08 19.8 L 8.4 19.8 L 8.4 8.2 L 1.08 8.2 A 1.036 1.036 0 0 1 0.33 7.89 A 1.31 1.31 0 0 1 0.32 7.88 Q 0 7.56 0 7.12 L 0 1.08 A 1.036 1.036 0 0 1 0.31 0.33 A 1.31 1.31 0 0 1 0.32 0.32 Q 0.64 0 1.08 0 L 26.44 0 A 1.036 1.036 0 0 1 27.19 0.31 A 1.31 1.31 0 0 1 27.2 0.32 Q 27.52 0.64 27.52 1.08 L 27.52 7.12 A 1.036 1.036 0 0 1 27.21 7.87 A 1.31 1.31 0 0 1 27.2 7.88 Q 26.88 8.2 26.44 8.2 Z'
						id='0'
					/>
					<path
						d='M 52.84 0 L 60.28 0 A 1.036 1.036 0 0 1 61.03 0.31 A 1.31 1.31 0 0 1 61.04 0.32 Q 61.36 0.64 61.36 1.08 L 61.36 26.92 A 1.036 1.036 0 0 1 61.05 27.67 A 1.31 1.31 0 0 1 61.04 27.68 Q 60.72 28 60.28 28 L 53.84 28 Q 52.88 28 52.24 27.16 L 43.52 16.04 L 43.52 26.92 A 1.036 1.036 0 0 1 43.21 27.67 A 1.31 1.31 0 0 1 43.2 27.68 Q 42.88 28 42.44 28 L 35 28 A 1.036 1.036 0 0 1 34.25 27.69 A 1.31 1.31 0 0 1 34.24 27.68 Q 33.92 27.36 33.92 26.92 L 33.92 1.08 A 1.036 1.036 0 0 1 34.23 0.33 A 1.31 1.31 0 0 1 34.24 0.32 Q 34.56 0 35 0 L 41.48 0 Q 42.44 0 43.04 0.8 L 51.76 12.84 L 51.76 1.08 A 1.036 1.036 0 0 1 52.07 0.33 A 1.31 1.31 0 0 1 52.08 0.32 Q 52.4 0 52.84 0 Z'
						id='1'
					/>
					<path
						d='M 68.88 0 L 81.64 0 A 28.116 28.116 0 0 1 85.253 0.22 Q 87.451 0.506 89.28 1.16 Q 92.52 2.32 94.52 5.08 Q 96.52 7.84 96.52 11.96 L 96.52 16.04 A 14.875 14.875 0 0 1 96.103 19.68 A 9.361 9.361 0 0 1 92.2 25.36 A 14.461 14.461 0 0 1 87.928 27.25 Q 86.024 27.766 83.766 27.927 A 29.864 29.864 0 0 1 81.64 28 L 68.88 28 A 1.036 1.036 0 0 1 68.13 27.69 A 1.31 1.31 0 0 1 68.12 27.68 Q 67.8 27.36 67.8 26.92 L 67.8 1.08 A 1.036 1.036 0 0 1 68.11 0.33 A 1.31 1.31 0 0 1 68.12 0.32 Q 68.44 0 68.88 0 Z M 81.84 7.8 L 78.2 7.8 L 78.2 20.2 L 81.84 20.2 A 6.372 6.372 0 0 0 83.04 20.094 Q 83.735 19.961 84.284 19.661 A 3.474 3.474 0 0 0 84.82 19.3 A 2.929 2.929 0 0 0 85.875 17.396 A 4.285 4.285 0 0 0 85.92 16.76 L 85.92 11.24 Q 85.92 9.6 84.82 8.7 A 3.753 3.753 0 0 0 83.431 7.998 Q 82.899 7.85 82.27 7.813 A 7.305 7.305 0 0 0 81.84 7.8 Z'
						id='2'
					/>
					<path
						d='M 112.76 17.68 L 112.76 20.2 L 128.72 20.2 A 1.036 1.036 0 0 1 129.47 20.51 A 1.31 1.31 0 0 1 129.48 20.52 Q 129.8 20.84 129.8 21.28 L 129.8 26.92 A 1.036 1.036 0 0 1 129.49 27.67 A 1.31 1.31 0 0 1 129.48 27.68 Q 129.16 28 128.72 28 L 103.44 28 A 1.036 1.036 0 0 1 102.69 27.69 A 1.31 1.31 0 0 1 102.68 27.68 Q 102.36 27.36 102.36 26.92 L 102.36 1.08 A 1.036 1.036 0 0 1 102.67 0.33 A 1.31 1.31 0 0 1 102.68 0.32 Q 103 0 103.44 0 L 128.32 0 A 1.036 1.036 0 0 1 129.07 0.31 A 1.31 1.31 0 0 1 129.08 0.32 Q 129.4 0.64 129.4 1.08 L 129.4 6.72 A 1.036 1.036 0 0 1 129.09 7.47 A 1.31 1.31 0 0 1 129.08 7.48 Q 128.76 7.8 128.32 7.8 L 112.76 7.8 L 112.76 10.32 L 126.12 10.32 A 1.036 1.036 0 0 1 126.87 10.63 A 1.31 1.31 0 0 1 126.88 10.64 Q 127.2 10.96 127.2 11.4 L 127.2 16.6 A 1.036 1.036 0 0 1 126.89 17.35 A 1.31 1.31 0 0 1 126.88 17.36 Q 126.56 17.68 126.12 17.68 L 112.76 17.68 Z'
						id='3'
					/>
					<path
						d='M 156.04 13.68 L 164.6 26.68 Q 164.685 26.794 164.71 26.988 A 1.367 1.367 0 0 1 164.72 27.16 A 0.761 0.761 0 0 1 164.561 27.624 A 1.059 1.059 0 0 1 164.46 27.74 A 0.876 0.876 0 0 1 164.136 27.951 A 0.868 0.868 0 0 1 163.84 28 L 155.24 28 A 1.999 1.999 0 0 1 154.476 27.86 Q 154.008 27.668 153.688 27.215 A 2.384 2.384 0 0 1 153.6 27.08 L 149.72 21.12 L 145.92 27.08 A 2.191 2.191 0 0 1 145.42 27.632 Q 144.942 27.997 144.29 28 A 2.353 2.353 0 0 1 144.28 28 L 135.64 28 A 0.845 0.845 0 0 1 135.028 27.748 A 1.053 1.053 0 0 1 135.02 27.74 A 0.973 0.973 0 0 1 134.857 27.528 A 0.742 0.742 0 0 1 134.76 27.16 Q 134.76 26.848 134.874 26.689 A 0.422 0.422 0 0 1 134.88 26.68 L 143.72 13.16 L 135.84 1.32 Q 135.755 1.207 135.73 1.013 A 1.367 1.367 0 0 1 135.72 0.84 A 0.761 0.761 0 0 1 135.879 0.377 A 1.059 1.059 0 0 1 135.98 0.26 A 0.876 0.876 0 0 1 136.304 0.05 A 0.868 0.868 0 0 1 136.6 0 L 145.24 0 Q 146.28 0 146.92 1 L 150.04 6.12 L 153.4 0.92 A 2.686 2.686 0 0 1 153.876 0.416 A 1.814 1.814 0 0 1 155.04 0 L 163.64 0 A 0.845 0.845 0 0 1 164.252 0.252 A 1.053 1.053 0 0 1 164.26 0.26 A 0.973 0.973 0 0 1 164.424 0.473 A 0.742 0.742 0 0 1 164.52 0.84 Q 164.52 1.152 164.406 1.312 A 0.422 0.422 0 0 1 164.4 1.32 L 156.04 13.68 Z'
						id='4'
					/>
				</g>
			</svg>
		</div>
	);
};