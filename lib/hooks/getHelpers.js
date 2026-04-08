import { getList } from '@/lib/api_wrap/configAPI';
export async function fetchAllSignalsInTheEnv(
	envName,
	sorted = false,
	namesOnly,
	sul = false
) {
	const newGroups = await getList('GroupOfSignals', envName);
	if (Array.isArray(newGroups)) {
		if (newGroups.length > 0) {
			const promises = newGroups.map(async group => {
				const temp = await getList(sul ? 'SulSignal' : 'Signal', group.name);
				if (temp != undefined) {
					if (!sorted) {
						return {
							name: String(group.name),
							temp: [
								...temp.reduce((acc, item) => {
									const entry = namesOnly
										? item.name
										: {
												...item,
												parentGroup: group.name,
											};

									if (sul) entry.bool = item.firstBit == item.lastBit;
									acc.push(entry);
									return acc;
								}, []),
							],
						};
					} else {
						return {
							name: String(group.name),
							outputs: temp.reduce((acc, item) => {
								console.log('item', item);
								if (item.isOutput) {
									acc.push(
										namesOnly ? item.name : { ...item, parentGroup: group.name }
									);
								}
								return acc;
							}, []),
							inputs: temp.reduce((acc, item) => {
								console.log('item', item);
								if (!item.isOutput) {
									acc.push(
										namesOnly ? item.name : { ...item, parentGroup: group.name }
									);
								}
								return acc;
							}, []),
						};
					}
				} else {
					return {
						name: String(group.name),
						temp: [],
					};
				}
			});
			const results = await Promise.all(promises);
			if (!sorted) {
				const newData = results.reduce((acc, { name, temp }) => {
					acc[name] = temp;
					return acc;
				}, {});

				const newList = results.reduce((acc, { temp }) => {
					return [...acc, ...temp];
				}, []);

				return { data: newData, groups: newGroups, list: newList };
			} else {
				const newData = results.reduce((acc, { name, outputs, inputs }) => {
					acc[name] = { outputs: outputs, inputs: inputs };
					return acc;
				}, {});
				return { data: newData, groups: newGroups };
			}
		} else {
			return { data: {}, groups: [] };
		}
	} else {
		throw new Error('не удалось получить список групп');
	}
}
