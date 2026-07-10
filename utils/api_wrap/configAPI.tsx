import { netError } from '@/utils/api_wrap/netError';
export async function getList(
	type: string,
	parentName: string | null = null,
	schemeName: string | null = null
) {
	console.log('getting list of ', type);
	let api;
	if (['Signal', 'SulSignal'].includes(type)) {
		if (parentName == null) {
			throw new Error(`Не указана группа`);
		}
		if (schemeName == null) {
			throw new Error(`Не указано рабочее пространство`);
		}
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}?parentName=${parentName}&schemeName=${schemeName}`;
	} else
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}${parentName ? `?parentName=${parentName}` : ''}`;
	const response = await fetch(api, {
		method: 'GET',
		//headers: {'Content-Type': 'application/json',}
	});
	console.log('received response on getting list');
	if (!response.ok) {
		throw netError(response, 'при получении данных', type);
	}
	const result = await response.json();
	console.log('received result on getting list', result);
	return result;
}
export async function checkExistence(
	type: string,
	name: string,
	group: string | null = null,
	schemeName: string | null = null
) {
	console.log('params', type, name, group, schemeName);
	let api;
	if (['Signal', 'SulSignal'].includes(type)) {
		if (group == null) {
			throw new Error(`Не указана группа сигнала`);
		}
		if (schemeName == null) {
			throw new Error(`Не указано рабочее пространство`);
		}
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}/exists?schemeName=${schemeName}&group=${group}&signal=${name}`;
	} else if (type == 'GroupOfSignals') {
		if (schemeName == null) {
			throw new Error(`Не указано рабочее пространство`);
		}
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}/exists?schemeName=${schemeName}&name=${name}`;
	} else {
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}/exists?name=${name}`;
	}
	const response = await fetch(api, {
		method: 'GET',
		//headers: {'Content-Type': 'application/json',}
	});
	if (!response.ok) {
		throw new Error(`Ошибка сети ${response.status}`);
	}
	const result = await response.json();
	return result;
}
export async function postEntity(type: string, body: Object) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/configurator/${type}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		}
	);
	console.log(
		'sent',
		JSON.stringify(body),
		' on ',
		`${process.env.API_URL}/api/river/v1/configurator/${type}`
	);
	if (!response.ok) {
		throw new Error(`Ошибка сети ${response.status}`);
	}
	const result = await response.json();
	return result;
}
export async function patchEntity(type: string, body: Object) {
	console.log(
		'patching on api',
		`${process.env.API_URL}/api/river/v1/configurator/${type}`,
		'with body',
		body
	);
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/configurator/${type}`,
		{
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		}
	);
	if (!response.ok) {
		throw new Error(`Ошибка сети ${response.status}`);
	}
	const result = await response.json();
	return result;
}
export async function deleteEntity(
	type: string,
	name: string,
	group: string | null = null,
	schemeName: string | null = null
) {
	let api;
	if (['Signal', 'SulSignal'].includes(type)) {
		if (group == null) {
			throw new Error(`Не указана группа сигнала`);
		}
		if (schemeName == null) {
			throw new Error(`Не указано рабочее пространство`);
		}
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}?schemeName=${schemeName}&group=${group}&signal=${name}`;
	} else if (type == 'GroupOfSignals') {
		if (schemeName == null) {
			throw new Error(`Не указано рабочее пространство`);
		}
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}?name=${name}&schemeName=${schemeName}`;
	} else {
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}?name=${name}`;
	}
	console.log('del on url', api);
	const response = await fetch(api, {
		method: 'DELETE',
		//headers: {'Content-Type': 'application/json',}
	});
	if (!response.ok) {
		throw new Error(`Ошибка сети ${response.status}`);
	}
	return;
}
