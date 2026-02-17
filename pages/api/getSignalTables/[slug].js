import { getList } from '@/lib/api_wrap/configAPI';
export default function handler(req, res) {
	let sorted = false;
	if ('sortedSignals' in req.query) {
		sorted = req.query.sortedSignals;
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
	const fetchSignals = async groupName => {
		try {
			console.log('try fetching signals');
			const result = await getList('Signal', groupName);
			console.log('fetched signals', result);
			return result;
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			}
		}
	};

	const fetchAll = async () => {
		console.log('fetching all');
		const newGroups = await fetchGroups();
		console.log('try mapping');
		if (newGroups.length > 0) {
			const promises = newGroups.map(async group => {
				const temp = await fetchSignals(group.name);
				console.log('fetching signals by group names', temp);
				console.log(
					temp.reduce((acc, item) => {
						acc.push({ ...item, parentGroup: group.name });
						return acc;
					}, [])
				);
				if (!sorted) {
					return {
						name: String(group.name),
						temp: temp.reduce((acc, item) => {
							console.log('item', item);
							acc.push({ ...item, parentGroup: group.name });
							return acc;
						}, []),
					};
				} else {
					return {
						name: String(group.name),
						outputs: temp.reduce((acc, item) => {
							console.log('item', item);
							if (item.isOutput) {
								acc.push({ ...item, parentGroup: group.name });
							}
							return acc;
						}, []),
						inputs: temp.reduce((acc, item) => {
							console.log('item', item);
							if (!item.isOutput) {
								acc.push({ ...item, parentGroup: group.name });
							}
							return acc;
						}, []),
					};
				}
			});
			const results = await Promise.all(promises);
			console.log('mapped', results);
			if (!sorted) {
				const newData = results.reduce((acc, { name, temp }) => {
					acc[name] = temp;
					return acc;
				}, {});
				console.log('reduced', newData);
				const newList = results.reduce((acc, { temp }) => {
					acc.push(temp);
					return acc;
				}, []);
				console.log('reduced data');
				res
					.status(200)
					.json({ data: newData, groups: newGroups, list: newList });
			} else {
				const newData = results.reduce((acc, { name, outputs, inputs }) => {
					acc[name] = { outputs: outputs, inputs: inputs };
					return acc;
				}, {});
				console.log('reduced', newData);
				console.log('reduced data');
				res.status(200).json({ data: newData, groups: newGroups });
			}
		} else {
			res.status(200).json({ data: {} });
		}
	};
	fetchAll();
}
