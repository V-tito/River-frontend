export async function getList(type, parentName = null) {
	console.log('getting list of ', type);
	console.log(
		'api',
		`${process.env.API_URL}/api/river/v1/configurator/${type}${parentName ? `?parentName=${parentName}` : ''}`
	);
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/configurator/${type}${parentName ? `?parentName=${parentName}` : ''}`,
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
export async function deleteEntity(type, name) {
	const response = await fetch(
		`${process.env.API_URL}/api/river/v1/configurator/${type}?name=${name}`,
		{
			method: 'DELETE',
			//headers: {'Content-Type': 'application/json',}
		}
	);
	if (!response.ok) {
		throw new Error(`Ошибка сети ${response.status}`);
	}
	const result = await response.json();
	return result;
}
