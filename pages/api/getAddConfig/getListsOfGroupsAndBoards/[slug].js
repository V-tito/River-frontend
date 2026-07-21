import { getList } from '@/utils/api_wrap/configAPI';
export default function handler(req, res) {
	const { slug } = req.query;
	const fetchGroups = async slug => {
		try {
			const result = await getList('GroupOfSignals', slug);
			return result;
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			} else {
				res.status(500).json({ message: String(err) });
			}
		}
	};
	const fetchBoards = async slug => {
		try {
			const result = await getList('TestBoard', slug);
			return result;
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			} else {
				res.status(500).json({ message: String(err) });
			}
		}
	};
	const fetchSul = async slug => {
		try {
			const result = await getList('Sul', slug);
			return result;
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			} else {
				res.status(500).json({ message: String(err) });
			}
		}
	};
	const processConfig = async slug => {
		try {
			const resBoards = await fetchBoards(slug);
			const resGroups = await fetchGroups(slug);
			const resSul = await fetchSul(slug);
			const tempBoardNames = resBoards.reduce((acc, item) => {
				return (acc = { ...acc, [item.name]: item.id });
			}, {});
			const tempGroupNames = resGroups.reduce((acc, item) => {
				return (acc = { ...acc, [item.name]: item.id });
			}, {});
			res.status(200).json({
				boards: tempBoardNames,
				groups: tempGroupNames,
				sul: resSul ? { [resSul.name]: resSul.id } : null,
			});
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			}
		}
	};
	processConfig(slug);
}
