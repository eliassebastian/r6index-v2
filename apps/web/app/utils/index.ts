interface ExponentialBackoffOptions<T extends any[]> {
	maxRetries?: number;
	initialDelayMs?: number;
	fnArgs: T;
}

export const retryWithExponentialBackoff = <T, U extends any[]>(
	fn: (...args: U) => Promise<T>,
	options: ExponentialBackoffOptions<U>,
) => {
	const { maxRetries = 5, initialDelayMs = 1000, fnArgs } = options;
	let attempt = 0;

	const execute = async (): Promise<T> => {
		try {
			return await fn(...fnArgs);
		} catch (error) {
			attempt++;
			if (attempt >= maxRetries) {
				throw error;
			}

			const delayMs = initialDelayMs * 2 ** attempt;
			console.error(`Retry attempt ${attempt} after ${delayMs}ms`);
			await new Promise((resolve) => setTimeout(resolve, delayMs));
			return execute();
		}
	};

	return execute();
};

export const calculateRatio = (numerator: number, denominator: number) => {
	if (numerator === 0 && denominator === 0) return 0;
	return denominator === 0 ? numerator : numerator / denominator;
};

export function getUniqueIds(objArray: any | undefined, idArray: string[] | null): string[] {
	// If objArray does not exist, return idArray as is
	if (!objArray || !idArray) {
		console.log('objArray does not exist');
		return idArray || [];
	}

	const uniqueIdsSet = new Set<string>(idArray); // Initialize the Set with idArray to ensure its uniqueness from the start

	// Add ids from objArray to the Set
	for (const item of objArray) {
		if (item?.id) uniqueIdsSet.add(item.id);
	}

	// Convert the Set back to an array to get unique IDs
	return Array.from(uniqueIdsSet);
}
