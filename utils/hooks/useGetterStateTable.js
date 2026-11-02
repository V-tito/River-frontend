import { useState, useRef, useEffect } from 'react';
import { fetchAllStates } from '../../../utils/api_wrap/dataProcessingHelpers/getStateHelpers';

export default function useGetterStateTable(
	envName,
	pollFlagRef,
	gettersListRef,
	setPollingError
) {
	const [getterStates, setGetterStates] = useState(
		Array.isArray(gettersListRef.current)
			? gettersListRef.current.reduce((acc, sig) => {
					return { ...acc, [sig.name]: { on: -1, valid: false } };
				}, {})
			: {}
	);
	const [loadingTable, setLoadingTable] = useState(false);
	const responseWaiting = useRef(false);
	const setResponseWaiting = val => {
		responseWaiting.current = val;
	};
	const intervalId = useRef();
	const resetPolling = () => {
		setLoadingTable(true);
		setGetterStates(
			Array.isArray(gettersListRef.current)
				? gettersListRef.current.reduce((acc, sig) => {
						return { ...acc, [sig.name]: { on: -1, valid: false } };
					}, {})
				: {}
		);
		if (intervalId.current) clearInterval(intervalId.current);
		const firstFetch = async () => {
			console.debug('first fetch');
			await fetchAllStates(
				envName,
				pollFlagRef,
				gettersListRef.current,
				setPollingError,
				responseWaiting,
				setResponseWaiting,
				setGetterStates
			);
			console.debug('loading false');
			setLoadingTable(false);
		};
		firstFetch();
		intervalId.current = setInterval(
			fetchAllStates,
			1000,
			envName,
			pollFlagRef,
			gettersListRef.current,
			setPollingError,
			responseWaiting,
			setResponseWaiting,
			setGetterStates
		);
	};
	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.addEventListener('pagehide', () => {
			if (intervalId.current) clearInterval(intervalId.current);
		});
	}, []);
	return { getterStates, setGetterStates, loadingTable, resetPolling };
}
