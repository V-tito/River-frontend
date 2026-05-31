const netError = response =>
	new Error(
		`Ошибка сети ${response.status}: ${
			response.message != undefined ? response.message : 'неизвестная ошибка'
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
export async function getSignalState(schemeName, groupName, signalName) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/get?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}`;
	console.log('fetching signal state on api', api);
	const response = await fetch(api, {
		method: 'GET',
	});
	if (!response.ok) {
		throw netError(response);
	}
	const result = await response.json();
	console.log('received signal state', result);
	return result;
}
export async function setSignalState(schemeName, groupName, signalName, value) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/set?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${Boolean(value)}`;
	const response = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	console.log('send setting state request', api);
	console.log('response', response);
	if (!response.ok) {
		console.log('net error');
		throw netError(response);
	}
	console.log('returning res');
	const result = await response.text();
	console.log('res', result);
	return result;
}
export async function presetSignalState(
	schemeName,
	groupName,
	signalName,
	value
) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/preset?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${Boolean(value)}`;
	const response = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	console.log('send presetting state request', api);
	console.log('response', response);
	if (!response.ok) {
		throw netError(response);
	}
	console.log('returning res');
	const result = await response.text();
	console.log('res', result);
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
	const api = `${process.env.API_URL}/api/river/v1/protocol/setPulse?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${Boolean(value)}&pulseTime=${pulseTime}&period=${period}`;
	const response = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	console.log('send setting pulse request', api);
	console.log('response', response);
	if (!response.ok) {
		throw netError(response);
	}
	console.log('returning res');
	const result = await response.text();
	console.log('res', result);
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
	const api = `${process.env.API_URL}/api/river/v1/protocol/presetPulse?schemeName=${schemeName}&groupName=${groupName}&signalName=${signalName}&value=${Boolean(value)}&pulseTime=${pulseTime}&period=${period}`;
	const response = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});
	console.log('send presetting pulse request', api);
	console.log('response', response);
	if (!response.ok) {
		throw netError(response);
	}
	console.log('returning res');
	const result = await response.text();
	console.log('res', result);
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
		throw netError(response);
	}
	const result = await response.text();
	return result;
}
