import { useCallback } from 'react';

export function usePersistentData(options) {
	const { storageKey, storageType = 'session' } = options;
	const storage = storageType === 'local' ? localStorage : sessionStorage;

	// Save form data
	const saveData = useCallback(
		data => {
			try {
				storage.setItem(storageKey, JSON.stringify(data));
			} catch (error) {
				consosle.error('не удалось сохранить форму:', error);
			}
		},
		[storageKey, storageType]
	);

	// Load form data
	const loadData = useCallback(() => {
		try {
			const data = storage.getItem(storageKey);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error('не удалось загрузить форму:', error);
			return null;
		}
	}, [storageKey, storageType]);

	// Clear stored data
	const clearData = useCallback(() => {
		storage.removeItem(storageKey);
		console.debug('cleared data');
	}, [storageKey, storageType]);

	return { saveData, loadData, clearData };
}
