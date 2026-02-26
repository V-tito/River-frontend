const netError = response =>
	new Error(
		`Ошибка сети ${response.status}: ${
			response.message !== undefined ? response.message : 'неизвестная ошибка'
		}`
	);
export async function getBoardState(name) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/nop?name=${name}`,
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError(response);
	}
	const result = await response.json();
	return result;
}
export async function getSignalState(groupName, signalName) {
	console.log(
		'fetching signal state on api',
		`${process.env.API_URL}/api/river/v1/protocol/get?groupName=${groupName}&signalName=${signalName}`
	);
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/get?groupName=${groupName}&signalName=${signalName}`,
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError(response);
	}
	const result = await response.json();
	console.log('received signal state', result);
	return result;
}
export async function setSignalState(groupName, signalName, value) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/set?groupName=${groupName}&signalName=${signalName}&value=${value}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	console.log(
		'send setting state request',
		`${process.env.API_URL}/api/river/v1/protocol/set?groupName=${groupName}&signalName=${signalName}&value=${value}`
	);
	if (!response.ok) {
		console.log('net error');
		throw netError(response);
	}
	const result = await response.json();
	return result;
}
export async function presetSignalState(groupName, signalName, value) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/get?groupName=${groupName}&signalName=${signalName}&value=${value}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError(response);
	}
	const result = await response.json();
	return result;
}
export async function setPulse(
	groupName,
	signalName,
	value,
	pulseTime,
	period
) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/get?groupName=${groupName}&signalName=${signalName}&value=${value}&pulseTime=${pulseTime}&period=${period}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError(response);
	}
	const result = await response.json();
	return result;
}
export async function presetPulse(
	groupName,
	signalName,
	value,
	pulseTime,
	period
) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/get?groupName=${groupName}&signalName=${signalName}&value=${value}&pulseTime=${pulseTime}&period=${period}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError(response);
	}
	const result = await response.json();
	return result;
}
export async function executePresets() {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/executePresets`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError(response);
	}
	const result = await response.json();
	return result;
}
