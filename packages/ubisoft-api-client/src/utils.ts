export const calculateRatio = (numerator: number, denominator: number) => {
	if (numerator === 0 && denominator === 0) return 0;
	return denominator === 0 ? numerator : numerator / denominator;
};

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
