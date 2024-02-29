import { ReactNode } from 'react';

interface PageProps {
	children: ReactNode;
}

const Page = ({ children }: PageProps) => {
	return <div className='flex flex-col h-dvh max-h-dvh w-full px-4 lg:px-20'>{children}</div>;
};

interface HeaderProps {
	children: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
	return <header className='flex flex-col w-full max-w-6xl mx-auto'>{children}</header>;
};

interface BodyProps {
	children: ReactNode;
}

const Body = ({ children }: BodyProps) => {
	return (
		<main className='grow w-full mx-auto max-w-6xl bg-accent-2 shadow-xl flex flex-col rounded-xl'>{children}</main>
	);
};

const Footer = () => {
	return (
		<footer className='h-20 bg-accent-1'>
			<div className='flex w-full h-full items-center justify-center mx-auto max-w-6xl'>
				<span className='text-xs text-center text-accent-7'>
					© 2024 R6 Index. Rainbow Six Siege is a registered trademark of Ubisoft.
				</span>
			</div>
		</footer>
	);
};

export const ErrorLayout = {
	Page,
	Header,
	Body: Body,
	Footer: Footer,
};
