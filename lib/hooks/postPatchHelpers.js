import {
	postEntity,
	patchEntity,
	checkExistence,
} from '@/lib/api_wrap/configAPI';
const fetchGroupsAndBoards = async defaultScheme => {
	try {
		const response = await fetch(
			`/api/getAddConfig/getListsOfGroupsAndBoards/${defaultScheme.name}`
		);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(`Ошибка сети ${response.status}`);
		}
		return data;
	} catch (err) {
		console.log('error fetching nameToIds', err.status, err.message);
	}
};

async function preprocessData(data, table, defaultScheme) {
	let newFormData = { ...data };
	const nameToId = await fetchGroupsAndBoards(defaultScheme);
	if (
		['GroupOfSignals', 'TestBoard', 'Sul'].includes(table) &&
		!('signals' in data)
	) {
		newFormData = { ...newFormData, signals: [] };
		newFormData['parentScheme'] = {
			id: defaultScheme.id,
			name: defaultScheme.name,
		};
	}
	if ('parentGroup' in data) {
		newFormData['parentGroup'] = { id: nameToId.groups[data.parentGroup] };
	}
	if ('testBoard' in data) {
		newFormData['testBoard'] = { id: nameToId.boards[data.testBoard] };
	}
	if ('parentSul' in data) {
		newFormData['parentSul'] = { id: nameToId.sul[data.parentSul] };
	}
	if (table == 'Signal') {
		delete newFormData.parentSul;
	}
	if (table == 'SulSignal') {
		delete newFormData.testBoard;
	}
	return newFormData;
}

export async function postHelper(data, table, defaultScheme) {
	const newFormData = await preprocessData(data, table, defaultScheme);
	await postEntity(table, newFormData);
	return;
}
export async function patchHelper(data, table, defaultScheme) {
	const newFormData = await preprocessData(data, table, defaultScheme);
	await patchEntity(table, newFormData);
	return;
}

async function processFileEntry(entry, table, defaultScheme) {
	console.log('processing entry', entry, 'with type', table);
	try {
		console.log('checking existence');
		const exists = await checkExistence(
			table,
			entry.name,
			entry.parentGroup ? entry.parentGroup : null
		);
		console.log('existence', exists);
		if (exists) {
			await patchHelper(entry, table, defaultScheme);
			return 'patch';
		} else {
			await postHelper(entry, table, defaultScheme);
			return 'post';
		}
	} catch (err) {
		return `error ${err.status} ${err.message}`;
	}
}
export async function multiplePostPatch(data, table, defaultScheme) {
	console.log('received data', data);
	console.log('received type', table);
	var results = { posted: 0, patched: 0 };
	console.log('results', results);
	console.log('processing entries');
	if (Array.isArray(data)) {
		const promises = data.reduce((acc, entry, index) => {
			let type;
			type = table;
			if ('parentSul' in entry) {
				type = 'SulSignal';
			}
			if ((table == 'TestBoard') & ('comPort' in entry)) {
				type = 'Sul';
			}
			return [...acc, processFileEntry(entry, type, defaultScheme)];
		}, []);
		const responses = await Promise.all(promises);
		console.log('responses', responses);
		responses.map((item, index) => {
			console.log('res', item);
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
		console.log('end results', results);
		return results;
	}
}
