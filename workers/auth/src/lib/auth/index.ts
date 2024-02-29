import type { Profile } from '../../services/auth';

export function createCredentialRotator(profiles: Profile[], initialIndex = -1) {
	// Initialize with the provided index or default to -1
	let currentIndex = initialIndex;

	return {
		getNextProfile: () => {
			// Move to the next profile, wrapping around to the first profile if at the end of the list
			currentIndex = (currentIndex + 1) % profiles.length;
			return profiles[currentIndex] as Profile;
		},
		getCurrentIndex: () => {
			// Return the current index
			return currentIndex;
		},
		setCurrentIndex: (index: number) => {
			// Set the current index to the provided index
			if (index >= 0 && index < profiles.length) {
				currentIndex = index;
			} else {
				throw new Error('invalid index. Index should be between 0 and the number of profiles - 1.');
			}
		},
	};
}
