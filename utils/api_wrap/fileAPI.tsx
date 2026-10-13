import { netError } from './netError';
export async function saveDataAsJson(
	content: Object | string,
	folder: string,
	filename: string
) {
	await fetch(`/api/files/gen?folder=${folder}$filename=${filename}`, {
		method: 'POST',
		body: JSON.stringify(content),
		keepalive: true,
	}).then(res => {
		if (!res.ok) throw netError(res, 'при сохранении файла');
	});
	return;
}
async function getFile(url: string, errspecs: string = '') {
	const response = await fetch(`/api/files/${url}`, {
		method: 'GET',
	});
	if (!response.ok) throw netError(response, errspecs);
	const result = await response.json();
	return result;
}
type exportSources =
	| 'tests'
	| 'CPs'
	| 'env-base'
	| 'env-all'
	| 'env-tests'
	| 'env-CPs';
/**
 * Единообразный экспорт файлов с разных файловых API. Use-case - DownloadButton. Возвращает promise, может кинуть ошибку сети! Должна оборачиваться в try... catch с соответствующей логике компонента обработкой ошибок
 * @param type  определяет api, с которого будет фетчиться файл
 * @param envName имя РП
 * @param sourceName имя файла (если фетчится 1 файл из ханилища тестов или панелей)
 * @returns promise с (на данный момент) JSON-распаршенным содержимым файла (object или array<object>). Возможен переезд на blob
 */
export async function exportFile(
	type: exportSources,
	envName: string,
	sourceName: string | undefined
) {
	if (['tests', 'CPs'].includes(type) && !sourceName)
		throw new Error('не указано имя файла');
	let url;
	switch (type) {
		case 'tests':
			url = `gen?folder=${envName}/tests&filename=${sourceName}`;
			return getFile(url, `при экспорте теста ${sourceName}`);
		case 'CPs':
			url = `gen?folder=${envName}/CPs&filename=${sourceName}`;
			return getFile(url, `при экспорте панели ${sourceName}`);
		case 'env-base':
			url = `getEnvConfig/${envName}`;
			return getFile(url, 'при экспорте конфигурации рабочего пространства');
		case 'env-tests':
		case 'env-CPs':
		case 'env-all':
	}
}
