import {
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

export function Tabs(props: TabsProps) {
	return (
		<RACTabs
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				tabsStyles({ ...renderProps, className }),
			)}
		/>
	);
}

const tabListStyles = tv({
	base: 'flex',
	variants: {
		orientation: {
			horizontal: 'flex-row',
			vertical: 'flex-col items-start',
		},
	},
});

export function TabList<T extends object>(props: TabListProps<T>) {
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
			true: 'text-accent-12 before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:w-[80%] before:h-px before:bg-accent-11',
		},
		isDisabled: {
			true: 'text-gray-200 dark:text-zinc-600 forced-colors:text-[GrayText] selected:text-gray-300 dark:selected:text-zinc-500 forced-colors:selected:text-[HighlightText] selected:bg-gray-200 dark:selected:bg-zinc-600 forced-colors:selected:bg-[GrayText]',
		},
	},
});

export function Tab(props: TabProps) {
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

export function TabPanel(props: TabPanelProps) {
	return (
		<RACTabPanel
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				tabPanelStyles({ ...renderProps, className }),
			)}
		/>
	);
}
