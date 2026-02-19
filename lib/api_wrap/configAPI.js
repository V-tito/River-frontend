export async function getList(type, parentName = null) {
	console.log('getting list of ', type);
	console.log(
		'api',
		`${process.env.API_URL}/api/river/v1/configurator/${type}${parentName ? `?parentName=${parentName}` : ''}`
	);
	try {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/configurator/${type}${parentName ? `?parentName=${parentName}` : ''}`,
		{
			method: 'GET',
			//headers: {'Content-Type': 'application/json',}
		}
	);
	console.log('received response on getting list')
	if (!response.ok) {
		throw new Error(`Ошибка сети ${response.status}`);
	}
	const result = await response.json();
	console.log("received result on getting list",result)
	return result;} catch (err){
		console.log('error fetching list', err)
		return {}
	}
}
export async function checkExistence(type, name) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/configurator/${type}/exists?name=${name}`,
		{
			method: 'GET',
			//headers: {'Content-Type': 'application/json',}
		}
	);
	if (!response.ok) {
		throw new Error(`Ошибка сети ${response.status}`);
	}
	const result = await response.json();
	return result;
}
export async function postEntity(type, body) {
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
export async function patchEntity(type, body) {
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
export async function deleteEntity(type, name, group = null) {
	let api;
	if (!['Signal', 'SulSignal'].includes(type)) {
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}?name=${name}`;
	} else {
		api = `${process.env.API_URL}/api/river/v1/configurator/${type}?group=${group}&signal=&${name}`;
	}
	console.log('del on url', api);
	const response = await fetch(api, {
		method: 'DELETE',
		//headers: {'Content-Type': 'application/json',}
	});
	if (!response.ok) {
		throw new Error(`Ошибка сети ${response.status}`);
	}
	const result = await response.json();
	return result;
}
