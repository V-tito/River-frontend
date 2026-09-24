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
	console.debug('response on abortable fetch', response);
	const result =
		method == 'POST' ? await response.text() : await response.json();
	return result;
}

export async function toggleScheme(schemeName, state = true, abort) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/turnOn?schemeName=${schemeName}&isTurnOn=${state}`;
	const result = await abortableFetch(
		api,
		abort,
		'при активации рабочего пространства',
		schemeName
	);
	return result;
}
export async function getBoardState(name, abort) {
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
export async function getSulState(schemeName, abort) {
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
export async function getSignalState(schemeName, groupName, signalName, abort) {
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
	abort
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
	abort
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
	abort
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
	abort
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
export async function executePresets(scheme, abort) {
	const api = `${process.env.API_URL}/api/river/v1/protocol/executePresets?schemeName=${scheme}`;
	const result = await abortableFetch(api, abort, '', scheme);
	return result;
}
/**
 * setAll протокола
 * @param {string} scheme имя схемы
 * @param {string} board имя платы (пока только ТП)
 * @param {Record<number,number>} vals массив значений
 */
export async function setAll(scheme, board, vals, abort) {
	let api = `${process.env.API_URL}/api/river/v1/protocol/setAll?testBoardName=${board}&`;
	Object.keys(vals).map(key => {
		if (vals[key] != -1) {
			api += 'value' + key + '=' + vals[key];
			api += '&';
		}
	});
	if (!api.includes('value'))
		throw new Error('Не указано новое значение ни для одного сигнала платы');
	api = api[api.length - 1] == '&' ? api.substring(0, api.length - 1) : api;
	const result = await abortableFetch(api, abort, '', scheme);
	return result;
}
/**
 * presetAll протокола
 * @param {string} schemeName имя схемы
 * @param {string} board имя платы (пока только ТП)
 * @param {Record<number,number>} vals массив значений
 */
export async function presetAll(scheme, board, vals, abort) {
	let api = `${process.env.API_URL}/api/river/v1/protocol/presetAll?testBoardName=${board}`;
	Object.keys(vals).map(key => {
		console.debug(
			'vals[key]',
			vals[key],
			'!=-1',
			vals[key] != -1,
			'!="-1"',
			vals[key] != '-1'
		);
		if (vals[key] != -1) {
			api += 'value' + key + '=' + vals[key];
			if (key < 31) api += '&';
		} else throw new Error('Не указано значение на канале ' + key);
	});
	const result = await abortableFetch(api, abort, '', scheme);
	return result;
}
