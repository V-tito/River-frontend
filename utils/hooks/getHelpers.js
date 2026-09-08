import { getList } from '@/utils/api_wrap/configAPI';

function formatSignalsByType(signals, groupName) {
	return signals.reduce(
		(acc, item) => {
			const sigFormated = { ...item, parentGroup: groupName };
			return item.isOutput
				? { ...acc, outputs: [...acc.outputs, sigFormated] }
				: { ...acc, inputs: [...acc.outputs, sigFormated] };
		},
		{ outputs: [], inputs: [] }
	);
}

export async function fetchAllSignalsInTheEnv(
	envName,
	sorted = false,
	sul = false
) {
	const newGroups = await getList('GroupOfSignals', envName);
	console.debug('got newGroups in fetchAllSignals', newGroups);
	if (Array.isArray(newGroups)) {
		if (newGroups.length > 0) {
			const promises = newGroups.map(async group => {
				try {
					console.debug('group in iteration in fetchallsigs', group);
					const temp = await getList(
						sul ? 'SulSignal' : 'Signal',
						group.name,
						envName
					);
					console.debug('got temp in fetchAllSignals', temp);

					if (temp != undefined) {
						if (!sorted) {
							console.debug('added sigs for a new group (unsorted)', {
								[String(group.name)]: temp.map(item => {
									const entry = {
										...item,
										parentGroup: group.name,
									};
									if (sul) entry.bool = item.firstBit == item.lastBit;
									return entry;
								}),
							});
							return {
								[String(group.name)]: temp.map(item => {
									const entry = {
										...item,
										parentGroup: group.name,
									};
									if (sul) entry.bool = item.firstBit == item.lastBit;
									return entry;
								}),
							};
						} else {
							console.debug('added sigs for a new group (sorted)', {
								[String(group.name)]: formatSignalsByType(temp, group.name),
							});
							return {
								[String(group.name)]: formatSignalsByType(temp, group.name),
							};
						}
					} else {
						console.debug('added sigs for a new group (sigs undef)', {
							[String(group.name)]: [],
						});
						return { [String(group.name)]: [] };
					}
				} catch (err) {
					console.debug('error making sigs by group', err);
				}
			});
			console.debug('got promises in fetchallsigs', promises);
			const resultsArray = await Promise.all(promises);
			const resultsrecord = resultsArray.reduce((acc, res) => {
				return { ...acc, ...res };
			}, {});
			console.debug(
				'made results for by group',
				resultsrecord,
				'with sul',
				sul
			);
			if (!sorted) {
				const newList = Object.values(resultsrecord).reduce((acc, temp) => {
					return [...acc, ...temp];
				}, []);
				console.debug('returning', {
					data: resultsrecord,
					groups: newGroups,
					list: newList,
				});
				return { data: resultsrecord, groups: newGroups, list: newList };
			} else {
				console.debug('returning', { data: resultsrecord, groups: newGroups });
				return { data: resultsrecord, groups: newGroups };
			}
		} else {
			return { data: {}, groups: [] };
		}
	} else {
		throw new Error('не удалось получить список групп');
	}
}

export async function fetchOutputsOfAllBoards(envName, isSul = false) {
	const boards = await getList('TestBoard', envName);
	//const sul = await getList('Sul', envName);
	const groups = await getList('GroupOfSignals', envName);
	if (Array.isArray(boards) && Array.isArray(groups)) {
		if (boards.length > 0 && groups.length > 0) {
			const promises = groups.map(async group => {
				const temp = await getList(
					//isSul ? 'SulSignal' :
					'Signal',
					group.name,
					envName
				);
				if (temp != undefined) {
					return temp;
				} else return;
			});
			const sigArrays = await Promise.all(promises);
			const sigs = sigArrays.reduce((acc, arr) => {
				return [...acc, ...arr];
			}, []);
			console.debug('got sigs in inps by board', sigs);
			const inputs = boards.reduce((acc, board) => {
				const toAdd = sigs.filter(
					item => item.testBoard.name == board.name && item.isOutput
				);
				return {
					...acc,
					[board.name]: toAdd,
				};
			}, {});
			console.debug('composed inputs', inputs);
			//const sulsigs = temp.filter(item => item.parentSul.name == sul.name);
			return { ...inputs };
			//, [sul]: sulsigs };
		} else return {};
	} else throw new Error('не удалось получить список групп или список плат');
}
