import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
	Key,
	Tab as RACTab,
	TabList as RACTabList,
	TabListProps,
	TabPanel as RACTabPanel,
	TabPanelProps,
	TabProps,
	Tabs as RACTabs,
	TabsProps,
	composeRenderProps,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { focusRing } from './utils';

const tabsStyles = tv({
	base: 'flex gap-2',
	variants: {
		orientation: {
			horizontal: 'flex-col',
			vertical: 'flex-row w-[800px]',
		},
	},
});

export function AnimatedTabs({ children, selectedKey, onSelectionChange, ...props }: TabsProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const tabRef = useRef<HTMLDivElement | null>(null);
	const [selectedKeyDimensions, setSelectedKeyDimensions] = useState<{
		x: number;
		width: number;
	}>({
		x: 0,
		width: 0,
	});

	const selectionChange = useCallback(
		(key: Key) => {
			// setSelectedKey(key);
			const selectedTab = ref.current?.querySelector<HTMLDivElement>(`[data-key="${key}"]`);

			// Assuming the pill's width is 80% of the selectedTab's width
			const pillWidth = selectedTab ? selectedTab.clientWidth * 0.6 : 0;

			// Calculate the half point of the selected tab
			const halfPointOfTab = selectedTab ? selectedTab.offsetLeft + selectedTab.clientWidth / 2 : 0;

			// Adjust the x position to center the pill on the tab
			// Since the pill is centered, you subtract half of the pill's width from the tab's half point
			const adjustedX = halfPointOfTab - pillWidth / 2;

			// Use the adjusted x position for the pill
			setSelectedKeyDimensions({
				x: adjustedX,
				width: pillWidth,
			});

			onSelectionChange?.(key);
		},
		[ref],
	);

	useEffect(() => {
		const selectedTab = ref.current?.querySelector<HTMLDivElement>(`[data-selected="true"]`);
		if (!selectedTab) return;

		selectionChange(selectedTab.dataset.key as Key);
	}, []);

	useEffect(() => {
		if (!selectedKey) return;

		const selectedTab = ref.current?.querySelector<HTMLDivElement>(`[data-key="${selectedKey}"]`);
		if (!selectedTab) return;

		// Assuming the pill's width is 80% of the selectedTab's width
		const pillWidth = selectedTab ? selectedTab.clientWidth * 0.6 : 0;

		// Calculate the half point of the selected tab
		const halfPointOfTab = selectedTab ? selectedTab.offsetLeft + selectedTab.clientWidth / 2 : 0;

		// Adjust the x position to center the pill on the tab
		// Since the pill is centered, you subtract half of the pill's width from the tab's half point
		const adjustedX = halfPointOfTab - pillWidth / 2;

		// Use the adjusted x position for the pill
		setSelectedKeyDimensions({
			x: adjustedX,
			width: pillWidth,
		});
	}, [selectedKey]);

	return (
		<RACTabs
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				tabsStyles({ ...renderProps, className }),
			)}
			ref={ref}
			onSelectionChange={selectionChange}
		>
			<div className='relative'>
				<div
					ref={tabRef}
					className={
						'absolute bg-accent-12 transition-[width,transform] h-px w-full -top-2 left-0 z-0 pointer-events-none'
					}
					style={{
						transform: `translateX(${selectedKeyDimensions.x}px)`,
						width: `${selectedKeyDimensions.width}px`,
					}}
				/>
				{children as ReactNode}
			</div>
		</RACTabs>
	);
}

const tabListStyles = tv({
	base: 'flex z-50',
	variants: {
		orientation: {
			horizontal: 'flex-row',
			vertical: 'flex-col items-start',
		},
	},
});

export function AnimatedTabList<T extends object>(props: TabListProps<T>) {
	return (
		<RACTabList
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				tabListStyles({ ...renderProps, className }),
			)}
		/>
	);
}

const tabProps = tv({
	extend: focusRing,
	base: 'relative flex items-center cursor-default rounded-lg px-2.5 py-1.5 text-sm transition-color forced-color-adjust-none hover:bg-accent-4 pressed:bg-accent-5',
	variants: {
		isSelected: {
			false: 'text-accent-11',
			true: 'text-accent-12',
		},
		isDisabled: {
			true: 'text-accent-11 opacity-70',
		},
	},
});

export function AnimatedTab(props: TabProps) {
	return (
		<RACTab
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				tabProps({ ...renderProps, className }),
			)}
		/>
	);
}

const tabPanelStyles = tv({
	extend: focusRing,
	base: 'flex-1 p-4 text-sm text-gray-900 dark:text-zinc-100',
});

export function AnimatedTabPanel(props: TabPanelProps) {
	return (
		<RACTabPanel
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				tabPanelStyles({ ...renderProps, className }),
			)}
		/>
	);
}
