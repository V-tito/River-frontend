import { netError } from '@/utils/api_wrap/netError';

export async function toggleScheme(schemeName, state = true) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/turnOn?schemeName=${schemeName}&isTurnOn=${state}`;
	const response = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	if (!response.ok) {
		throw netError(response, 'при активации рабочего пространства', schemeName);
	}
	const result = await response.text();
	return result;
}
export async function getBoardState(name) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/nop?name=${name}`,
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError(response, 'при связи с платой', name);
	}
	const result = await response.json();
	return result;
}
export async function getSulState(schemeName) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/sulNop?name=${schemeName}`,
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError(response, 'при связи с СУЛ схемы ', schemeName);
	}
	const result = await response.json();
	return result;
}
export async function getSignalState(schemeName, groupName, signalName) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/get?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}`;

	const response = await fetch(api, {
		method: 'GET',
	});
	if (!response.ok) {
		throw netError(
			response,
			'',
			`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`
		);
	}
	const result = await response.json();
	return result;
}
export async function setSignalState(schemeName, groupName, signalName, value) {
	console.debug('setting state with value', value)
	const api = `${process.env.API_URL}/api/river/v1/protocol/set?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${value==1}`;
	console.debug('setting signal state on api ', api);
	const response = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	console.debug('set response ', response);
	if (!response.ok) {
		console.debug('set resolved with error');
		throw netError(
			response,
			'',
			`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`
		);
	}
	const result = await response.text();
	console.debug('set result ', result);
	return result;
}
export async function presetSignalState(
	schemeName,
	groupName,
	signalName,
	value
) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/preset?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${value==1}`;
	console.debug('presetting signal state on api ', api);
	const response = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	console.debug('preset response ', response);
	if (!response.ok) {
		console.debug('preset resolved with error');
		throw netError(
			response,
			'',
			`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`
		);
	}
	const result = await response.text();
	console.debug('preset result ', result);
	return result;
}
export async function setPulse(
	schemeName,
	groupName,
	signalName,
	value,
	pulseTime,
	period
) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/setPulse?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${value==1}&pulseTime=${pulseTime}&period=${period}`;
	const response = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	if (!response.ok) {
		throw netError(
			response,
			'',
			`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`
		);
	}
	const result = await response.text();
	return result;
}
export async function presetPulse(
	schemeName,
	groupName,
	signalName,
	value,
	pulseTime,
	period
) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/presetPulse?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${value==1}&pulseTime=${pulseTime}&period=${period}`;
	const response = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	if (!response.ok) {
		throw netError(
			response,
			'',
			`${signalName} в группе ${groupName} рабочего пространства ${schemeName}`
		);
	}
	const result = await response.text();
	return result;
}
export async function executePresets(scheme) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/executePresets?schemeName=${scheme}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError(response, '', scheme);
	}
	const result = await response.text();
	return result;
}
