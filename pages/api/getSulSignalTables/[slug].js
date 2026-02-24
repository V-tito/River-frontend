import { getList } from '@/lib/api_wrap/configAPI';
export default function handler(req, res) {
	console.log('triggered endpoint fetch sul sighals')
	let namesOnly = false;
	if ('namesOnly' in req.query) {
		namesOnly = req.query.namesOnly;
	}
	const fetchGroups = async () => {
		const slug = req.query.slug;
		try {
			console.log('try fetching groups');
			const result = await getList('GroupOfSignals', slug);
			console.log('fetched groups', result);
			return result;
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			}
		}
	};
	const fetchSulSignals = async groupName => {
		try {
			console.log('try fetching sulSignals');
			const result = await getList('SulSignal', groupName);
			console.log('fetched sulSignals', result);
			return result;
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			} else {
				res.status(500).json({ message: 'неизвестная ошибка' });
			}
		}
	};

	const fetchAll = async () => {
		console.log('fetching all');
		const newGroups = await fetchGroups();
		console.log('try mapping');
		if (Array.isArray(newGroups)) {
			if (newGroups.length > 0) {
				const promises = newGroups.map(async group => {
					const sulTemp = await fetchSulSignals(group.name);
					console.log('fetching sulSignals by group names', sulTemp);
					return {
						name: String(group.name),
						temp: [...sulTemp.reduce((acc, item) => {
							console.log('item', item);
							acc.push(
								namesOnly
									? item.name
									: {
											...item,
											parentGroup: group.name,
											bool: item.firstBit==item.lastBit
										}
							);
							return acc;
						}, []),]
					};
				});
				const results = await Promise.all(promises);
				console.log('mapped', results);
				const newData = results.reduce((acc, { name, temp }) => {
					acc[name] = temp;
					return acc;
				}, {});
				console.log('reduced', newData);
				const newList = results.reduce((acc, { temp }) => {
					//acc.push(temp);
					return [...acc, ...temp];
				}, []);
				console.log('reduced data');
				res
					.status(200)
					.json({ data: newData, groups: newGroups, list: newList });
			} else {
				res.status(200).json({ data: {}, groups: {} });
			}
		} else {
			res.status(200).json({ data: {}, groups: {} });
		}
	};
	fetchAll();
}
