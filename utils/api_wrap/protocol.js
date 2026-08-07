import { netError } from '@/utils/api_wrap/netError';

async function abortableFetch(
	api,
	abort,
	errMessage = '',
	errEntity = '',
	method = 'POST'
) {
	const params = {
		method: method,
		headers: { 'Content-Type': 'application/json' },
	};
	const response = await fetch(
		api,
		abort?.signal ? { ...params, signal: abort.signal } : params
	);
	if (!response.ok) {
		throw netError(response, errMessage, errEntity);
	}
	const result =
		method == 'POST' ? await response.text() : await response.json();
	return result;
}

export async function toggleScheme(schemeName, state = true, abort = null) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/turnOn?schemeName=${schemeName}&isTurnOn=${state}`;
	const result = await abortableFetch(
		api,
		abort,
		'при активации рабочего пространства',
		schemeName
	);
	return result;
}
export async function getBoardState(name, abort = null) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/nop?name=${name}`;
	const result = await abortableFetch(
		api,
		abort,
		'при связи с платой',
		name,
		'GET'
	);
	return result;
}
export async function getSulState(schemeName, abort = null) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/sulNop?name=${schemeName}`;

	const result = await abortableFetch(
		api,
		abort,
		'при связи с СУЛ схемы ',
		schemeName,
		'GET'
	);
	return result;
}
export async function getSignalState(
	schemeName,
	groupName,
	signalName,
	abort = null
) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/get?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}`;
	const result = await abortableFetch(
		api,
		abort,
		'',
		`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`,
		'GET'
	);
	return result;
}
export async function setSignalState(
	schemeName,
	groupName,
	signalName,
	value,
	abort = null
) {
	console.debug('setting state with value', value);
	const api = `${process.env.API_URL}/api/river/v1/protocol/set?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${value == 1}`;
	console.debug('setting signal state on api ', api);
	const result = await abortableFetch(
		api,
		abort,
		'',
		`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`
	);
	console.debug('set result ', result);
	return result;
}
export async function presetSignalState(
	schemeName,
	groupName,
	signalName,
	value,
	abort = null
) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/preset?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${value == 1}`;
	console.debug('presetting signal state on api ', api);
	const result = await abortableFetch(
		api,
		abort,
		'',
		`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`
	);
	console.debug('preset result ', result);
	return result;
}
export async function setPulse(
	schemeName,
	groupName,
	signalName,
	value,
	pulseTime,
	period,
	abort = null
) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/setPulse?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${value == 1}&pulseTime=${pulseTime}&period=${period}`;
	const result = await abortableFetch(
		api,
		abort,
		'',
		`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`
	);
	return result;
}
export async function presetPulse(
	schemeName,
	groupName,
	signalName,
	value,
	pulseTime,
	period,
	abort = null
) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/presetPulse?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${value == 1}&pulseTime=${pulseTime}&period=${period}`;
	const result = await abortableFetch(
		api,
		abort,
		'',
		`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`
	);
	return result;
}
export async function executePresets(scheme, abort = null) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/executePresets?schemeName=${scheme}`;
	const result = await abortableFetch(api, abort, '', scheme);
	return result;
}
