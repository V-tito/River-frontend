import { netError } from './netError';
type testerFileCategories = 'tests' | 'CPs' | 'CPbackgrounds';
type fetchAllCategories = 'tests' | 'CPs' | 'CPbackgrounds' | 'base' | 'env';

/**
 * Единообразный экспорт файлов с разных файловых API. Use-case - DownloadButton. Возвращает promise, может кинуть ошибку сети! Должна оборачиваться в try... catch с соответствующей логике компонента обработкой ошибок
 * @param type  определяет api, с которого будет фетчиться файл
 * @param envName имя РП
 * @param sourceName имя файла (если фетчится 1 файл из ханилища тестов или панелей)
 * @returns promise с (на данный момент) JSON-распаршенным содержимым файла (object или array<object>). Возможен переезд на blob
 */
async function getFile(
	type: testerFileCategories,
	envName: string,
	sourceName: string | undefined
) {
	if (['tests', 'CPs', 'CPbackgrounds'].includes(type) && !sourceName)
		throw new Error('не указано имя файла');
	let url = `/api/tester-files/${envName}/${type}/get-file-contents`;
	if (sourceName) url += `?filename=${sourceName}`;
	const response = await fetch(url, {
		method: 'GET',
	});
	if (!response.ok)
		throw netError(
			response,
			`при попытке доступа к файлу ${sourceName} в ${envName}/${type}`
		);
	return response;
}

/**
 * Подгружает изображение фона из хранилища.
 *
 * @param envName имя рабочего пространства
 * @param filename имя файла
 * @returns URL изображения фона
 */
export async function getBackground(envName: string, filename: string) {
	const response = await getFile('CPbackgrounds', envName, filename);
	console.debug('response in getbackground', response);
	console.debug('response.headers in getbackground', response.headers);
	console.debug(
		'response.headers.get in getbackground',
		response.headers.get('Content-Type')
	);
	if (!response.headers.get('Content-Type')?.includes('image')) {
		console.debug(
			'error: non-image response header in backgrounds',
			response.headers.get('Content-Type'),
			'file requested:',
			filename,
			'env:',
			envName
		);
		throw new Error('Полученный объект не является изображением');
	}
	const result = await response.blob();
	const imageUrl = URL.createObjectURL(result);
	return imageUrl;
}
/**
 * Подгружает json из хранилища и парсит его
 * @param type  определяет api, с которого будет фетчиться файл
 * @param envName имя рабочего пространства
 * @param filename имя файла
 * @returns parsed Object
 */
export async function getJson(
	type: testerFileCategories,
	envName: string,
	filename: string
) {
	const response = await getFile(type, envName, filename);
	const result = (await response.blob()).text();
	const jsonContents = JSON.parse(await result);
	return jsonContents;
}
/**
 * Подгружает тест из хранилища и парсит его
 * @param envName имя рабочего пространства
 * @param filename имя файла
 * @returns parsed Object
 */
export async function getTest(envName: string, filename: string) {
	return await getJson('tests', envName, filename);
}
/**
 * Подгружает конфиг CP из хранилища и парсит его
 * @param envName имя рабочего пространства
 * @param filename имя файла
 * @returns parsed Object
 */
export async function getCP(envName: string, filename: string) {
	return await getJson('CPs', envName, filename);
}
export async function postBlob(
	type: testerFileCategories,
	envName: string,
	filename: string,
	content: Blob
) {
	console.debug('entered post blob');
	const dataToSend = new FormData();
	console.debug('got content to send', content);
	dataToSend.append('file', content, filename);
	console.debug(
		'sending request w data',
		dataToSend,
		'on api',
		`/api/tester-files/${envName}/${type}/access`
	);
	let response;
	if (content.size > 64 * 1024)
		response = await fetch(`/api/tester-files/${envName}/${type}/access`, {
			method: 'POST',
			body: dataToSend,
		}).catch(reason => {
			console.debug('rejected', reason);
			return reason;
		});
	else {
		response = await fetch(`/api/tester-files/${envName}/${type}/access`, {
			method: 'POST',
			body: dataToSend,
			keepalive: true,
		});
	}
	console.debug('response', response);
	if (!response.ok) throw netError(response);
	return response;
}
export async function postJson(
	type: testerFileCategories,
	envName: string,
	filename: string,
	content: Object | string
) {
	await fetch(
		`/api/tester-files/${envName}/${type}/access?filename=${filename}`,
		{
			method: 'POST',
			body: JSON.stringify(content),
			keepalive: true,
		}
	).then(res => {
		if (!res.ok) throw netError(res, 'при сохранении файла');
	});
	return;
}
export async function postImage(
	envName: string,
	filename: string,
	content: Blob
) {
	return await postBlob('CPbackgrounds', envName, filename, content);
}
export async function postTest(
	envName: string,
	filename: string,
	content: Blob
) {
	return await postBlob('tests', envName, filename, content);
}
export async function postCP(envName: string, filename: string, content: Blob) {
	return await postBlob('CPs', envName, filename, content);
}
export async function renameFile(
	type: testerFileCategories,
	envName: string,
	oldName: string,
	newName: string
) {
	const response = await fetch(
		`/api/tester-files/${envName}/${type}/rename?oldName=${oldName}&newName=${newName}`,
		{
			method: 'POST',
			keepalive: true,
		}
	);
	if (!response.ok) {
		throw netError(response);
	}
}
export async function deleteFile(
	type: testerFileCategories,
	envName: string,
	filename: string
) {
	const response = await fetch(
		`/api/tester-files/${envName}/${type}/access?filename=${filename}`,
		{
			method: 'DELETE',
		}
	);
	if (!response.ok) {
		throw netError(response);
	}
}
export async function getDirectoryStats(
	type: testerFileCategories,
	envName: string
) {
	let url = `/api/tester-files/${envName}/${type}/access`;
	const response = await fetch(url, {
		method: 'GET',
	});
	if (!response.ok)
		throw netError(response, `при попытке доступа к ${envName}/${type}`);
	return (await response.json())?.files;
}
export async function getCPlist(envName: string) {
	return getDirectoryStats('CPs', envName);
}
export async function getBackgroundsList(envName: string) {
	return getDirectoryStats('CPbackgrounds', envName);
}
export async function getTestList(envName: string) {
	return getDirectoryStats('tests', envName);
}
