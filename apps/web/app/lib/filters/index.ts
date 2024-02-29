export type Filter = {
	id: string;
	label: string;
	type: 'single' | 'multiple';
	filterType: 'range' | 'unique' | 'select';
	field?: string;
	options: {
		id: string;
		label: string;
		value:
			| string
			| {
					min?: number;
					max?: number;
			  };
	}[];
};

export type Filters = {
	[key: string]: Filter & { value?: string };
};

// Get nested property from object
const getNestedProperty = (obj: any, path: string) => {
	const properties = path.split('.');
	let currentObj = obj;
	for (const property of properties) {
		if (Object.prototype.hasOwnProperty.call(currentObj, property)) {
			currentObj = currentObj[property];
		} else {
			return undefined;
		}
	}

	return currentObj;
};

// Get unique values for a object field
export const uniqueFieldValues = (data: any[] | undefined, field: string) => {
	if (!data || !data.length) return [];
	const fieldValues = data.map((item) => getNestedProperty(item, field));
	const uniqueValues = [...new Set(fieldValues)];
	return uniqueValues;
};
