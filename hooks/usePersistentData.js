import { useCallback } from 'react';

export function usePersistentData(options) {
	const { storageKey, storageType = 'session' } = options;
	const storage = storageType === 'local' ? localStorage : sessionStorage;

	// Save form data
	const saveFormData = useCallback(
		data => {
			try {
				storage.setItem(storageKey, JSON.stringify(data));
			} catch (error) {
				console.error('Failed to save form data:', error);
			}
		},
		[storageKey, storageType]
	);

	// Load form data
	const loadFormData = useCallback(() => {
		try {
			const data = storage.getItem(storageKey);
			return data ? JSON.parse(data) : null;
		} catch (error) {
			console.error('Failed to load form data:', error);
			return null;
		}
	}, [storageKey, storageType]);

	// Clear stored data
	const clearFormData = useCallback(() => {
		storage.removeItem(storageKey);
	}, [storageKey, storageType]);

	return { saveFormData, loadFormData, clearFormData };
}
