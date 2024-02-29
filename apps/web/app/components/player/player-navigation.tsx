import { useEffect, useState } from 'react';
import type { Key, TabsProps } from 'react-aria-components';
import { AnimatedTab, AnimatedTabList, AnimatedTabs } from '~/components/shared/AnimatedTabs';

export const PlayerNavigation = ({ ...props }: TabsProps) => {
	const [selected, setSelected] = useState<Key>('overview');

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = entry.target.id;
					if (entry.isIntersecting) {
						setSelected(id as Key);
					}
				}
			},
			{ threshold: 0.75 },
		);

		// Track all sections that have an `id` applied
		const sections = document.querySelectorAll('section[id]');
		for (const section of sections) {
			observer.observe(section);
		}

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<AnimatedTabs
			{...props}
			selectedKey={selected}
			onSelectionChange={(key) => {
				setSelected(key);

				const element = document.getElementById(`${key}`);
				element?.scrollIntoView({
					behavior: 'instant',
					block: 'start',
					inline: 'start',
				});

				//const windowHeight = window.innerHeight;
				window.scrollBy(0, key === 'weapons' ? 120 : -150);
			}}
		>
			<AnimatedTabList>
				<AnimatedTab id='overview'>Overview</AnimatedTab>
				<AnimatedTab id='statistics'>Statistics</AnimatedTab>
				<AnimatedTab id='operators'>Operators</AnimatedTab>
				<AnimatedTab id='maps'>Maps</AnimatedTab>
				<AnimatedTab id='weapons'>Weapons</AnimatedTab>
			</AnimatedTabList>
		</AnimatedTabs>
	);
};
