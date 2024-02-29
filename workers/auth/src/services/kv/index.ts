export const put = async (kv: KVNamespace, key: string, value: any) => {
	const modifiedValue = typeof value !== 'string' ? JSON.stringify(value) : value;

	try {
		return await kv.put(key, modifiedValue);
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Failed to put ${key} in ${kv}`);
			return error;
		}

		throw new Error('An unknown error occurred while trying to put the value');
	}
};
