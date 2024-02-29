export const transform = (data: any) => {
	try {
		const result = data.profiles.filter((p: any) => p.platformType === 'uplay' && p.userId !== '');

		return result || null;
	} catch (error) {
		console.error('An error occurred in profile:', error);
		return null;
	}
};
