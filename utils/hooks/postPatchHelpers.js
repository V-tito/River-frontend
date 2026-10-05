import {
	postEntity,
	patchEntity,
	checkExistence,
} from '@/utils/api_wrap/configAPI';
const fetchGroupsAndBoards = async currentWS => {
	try {
		const response = await fetch(
			`/api/getAddConfig/getListsOfGroupsAndBoards/${currentWS.name}`
		);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(`Ошибка сети ${response.status}`);
		}
		return data;
	} catch (err) {}
};

async function preprocessData(data, table, currentWS) {
	console.debug('dta in preprocess data', data);
	let newFormData = { ...data };
	const nameToId = await fetchGroupsAndBoards(currentWS);
	if (
		['GroupOfSignals', 'TestBoard', 'Sul'].includes(table) &&
		!('signals' in data)
	) {
		newFormData = { ...newFormData, signals: [] };
		newFormData['parentScheme'] = {
			id: currentWS.id,
			name: currentWS.name,
		};
	}
	if ('parentGroup' in data) {
		if (typeof data.parentGroup != 'object')
			newFormData['parentGroup'] = { id: nameToId.groups[data.parentGroup] };
	}
	if ('testBoard' in data) {
		if (typeof data.testBoard != 'object')
			newFormData['testBoard'] = { id: nameToId.boards[data.testBoard] };
	}
	if ('parentSul' in data) {
		if (typeof data.parentSul != 'object')
			newFormData['parentSul'] = { id: nameToId.sul[data.parentSul] };
	}
	if (table == 'Signal') {
		delete newFormData.parentSul;
	}
	if (table == 'SulSignal') {
		delete newFormData.testBoard;
	}
	console.debug('preprocessed data', newFormData);
	return newFormData;
}

export async function postHelper(data, table, currentWS) {
	console.debug('data in postHelper', data);
	const newFormData =
		table == 'Scheme' ? data : await preprocessData(data, table, currentWS);
	await postEntity(table, newFormData);
	return;
}
export async function patchHelper(data, table, currentWS) {
	const newFormData =
		table == 'Scheme' ? data : await preprocessData(data, table, currentWS);
	await patchEntity(table, newFormData);
	return;
}

async function processFileEntry(entry, table, currentWS) {
	console.debug('entry in processFileEntry', entry);
	try {
		const exists = await checkExistence(
			table,
			entry.name,
			entry.parentGroup ? entry.parentGroup : null,
			currentWS != null ? currentWS.name : null
		);
		if (exists) {
			await patchHelper(entry, table, currentWS);
			return 'patch';
		} else {
			await postHelper(entry, table, currentWS);
			return 'post';
		}
	} catch (err) {
		return `error ${err.status} ${err.message}`;
	}
}
export async function multiplePostPatch(data, table, currentWS = null) {
	console.debug('data in multiple post patch', data);
	if (table != 'Scheme' && currentWS == null) {
		throw new Error('Не указано рабочее пространство');
	}
	var results = { posted: 0, patched: 0 };
	let newData;
	if (!Array.isArray(data)) {
		newData = [data];
	} else {
		newData = data;
	}
	const promises = newData.reduce((acc, entry, index) => {
		let type;
		type = table;
		if (entry == undefined) throw new Error('Некорректные данные');
		if ('parentSul' in entry) {
			type = 'SulSignal';
		}
		if ((table == 'TestBoard') & ('comPort' in entry)) {
			type = 'Sul';
		}
		return [...acc, processFileEntry(entry, type, currentWS)];
	}, []);
	const responses = await Promise.all(promises);
	responses.map((item, index) => {
		if (item == 'post') {
			results.posted += 1;
		} else {
			if (item == 'patch') {
				results.patched += 1;
			} else {
				results[index] = item;
			}
		}
	});
	return results;
}
