export type FilterConfig<T> = {
	[key: string]: {
		label: string;
		isMulti?: boolean;
		filterFunction?: (item: T, searchParam: any) => boolean;
		getOptions: (items: T[]) => { id: string; label: string }[];
	};
};

export type FilterOptions = { [key: string]: boolean };

export type Filter = {
	label: string;
	options: { id: string; label: string }[];
};
