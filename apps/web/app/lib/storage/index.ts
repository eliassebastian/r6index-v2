import localForage from 'localforage';

export const cacheStorage = localForage.createInstance({
	name: 'r6index:cache',
	driver: localForage.INDEXEDDB,
});

export const recentStorage = localForage.createInstance({
	name: 'r6index:recent',
	driver: localForage.LOCALSTORAGE,
});

export const bookmarkStorage = localForage.createInstance({
	name: 'r6index:bookmarks',
	driver: localForage.LOCALSTORAGE,
});
