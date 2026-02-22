import { getList } from '@/lib/api_wrap/configAPI';
export default function handler(req, res) {
	const { slug } = req.query;
	console.log(req.url);
	console.log('Scheme', slug);
	const fetchGroups = async slug => {
		try {
			const result = await getList('GroupOfSignals', slug);
			console.log('fetch groups', result);
			return result;
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			}
		}
	};
	const fetchBoards = async slug => {
		try {
			const result = await getList('TestBoard', slug);
			console.log('fetch boards', result);
			return result;
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			}
		}
	};
	const processConfig = async slug => {
		const resBoards = await fetchBoards(slug);
		console.log('RB', resBoards);
		const resGroups = await fetchGroups(slug);
		const tempBoardNames = resBoards.reduce((acc, item) => {
			return (acc = { ...acc, [item.id]: item.name });
		}, {});
		console.log(`tempBN:`, tempBoardNames);
		const tempGroupNames = resGroups.reduce((acc, item) => {
			return (acc = { ...acc, [item.id]: item.name });
		}, {});
		console.log(Object.entries(tempGroupNames));
		res.status(200).json({ boards: tempBoardNames, groups: tempGroupNames });
	};
	processConfig(slug);
}
