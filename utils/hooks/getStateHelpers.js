import {
	getSulState,
	getBoardState,
	getSignalState,
} from '@/utils/api_wrap/protocol';
async function fetchCurrentState(
	schemeName,
	sig,
	setPollingError,
	board = false
) {
	let result;
	let last = Date.now();
	console.log('fetching', sig.name, 'start', last);
	try {
		if (board) {
			if (sul) result = await getSulState(schemeName);
			else result = await getBoardState(sig.name);
		} else {
			result = await getSignalState(schemeName, sig.parentGroup, sig.name);
		}
		console.log('fetching', sig.name, 'set api in', Date.now() - last);
		last = Date.now();
		console.log(
			'fetching',
			sig.name,
			'waiting for response in',
			Date.now() - last
		);
		last = Date.now();
		console.log(
			'fetching',
			sig.name,
			'waiting for result in',
			Date.now() - last
		);
		console.log('received:', result);
		setPollingError('ok');

		if (!board) {
			return [
				sig.name,
				{
					on: result.value,
					checked: String(result.freshness.split('.')[0]),
				},
			];
		} else {
			return [
				sig.name,
				{
					on: result,
				},
			];
		}
	} catch (err) {
		setPollingError(err);
		console.log(err);
		return [
			sig.name,
			{
				on: undefined,
				checked: null,
			},
		];
	}
}
export async function fetchAllStates(
	schemeName,
	signals,
	setPollingError,
	responseWaiting,
	setResponseWaiting,

	setAllStates,
	board = false
) {
	if (!responseWaiting) {
		try {
			setResponseWaiting(true);
			console.log('start mapping on data', signals);
			const results = await Promise.all(
				signals.map(item =>
					fetchCurrentState(schemeName, item, setPollingError, board)
				)
			);
			console.log('polling results', results);
			setAllStates(prev => {
				const upd = { ...prev };
				results.forEach(result => {
					upd[result[0]] = result[1];
				});
				return upd;
			});
		} catch (err) {
			setPollingError(err);
			setAllStates(
				signals.reduce((acc, item) => {
					return {
						...acc,
						[item.name]: {
							on: undefined,
							checked: null,
						},
					};
				}, {})
			);
		} finally {
			setResponseWaiting(false);
		}
	}
}
