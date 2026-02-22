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
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError;
	}
	const result = await response.json();
	return result;
}
export async function getSignalState(groupName, signalName) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/protocol/get?groupName=${groupName}&signalName=${signalName}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		}
	);
	if (!response.ok) {
		throw netError;
	}
	const result = await response.json();
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
	if (!response.ok) {
		throw netError;
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
		throw netError;
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
		throw netError;
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
		throw netError;
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
		throw netError;
	}
	const result = await response.json();
	return result;
}
