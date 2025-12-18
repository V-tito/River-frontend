export default function handler(req, res) {
	const { slug } = req.query;
	console.log(req.url);
	console.log('Scheme', slug);
	const fetchGroups = async slug => {
		try {
			const response = await fetch(
				`${process.env.API_URL}/api/river/v1/configurator/GroupOfSignals/${slug}`,
				{
					method: 'GET', // headers: new Headers({'Content-Type': 'application/json'})
				}
			);
			if (!response.ok) {
				throw new Error('Ошибка сети');
			}
			console.log('fetch groups promise', response);
			const result = await response.json();
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
			const response = await fetch(
				`${process.env.API_URL}/api/river/v1/configurator/TestBoard/${slug}`,
				{
					method: 'GET', // headers: new Headers({'Content-Type': 'application/json'})
				}
			);
			if (!response.ok) {
				throw new Error(`Ошибка сети ${response.status}`);
			}
			console.log('fetch boards promise', response);
			const result = await response.json();
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
