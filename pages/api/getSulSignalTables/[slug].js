import { fetchAllSignalsInTheEnv } from '@/utils/hooks/getHelpers';
export default function handler(req, res) {
	let namesOnly = false;
	if ('namesOnly' in req.query) {
		namesOnly = req.query.namesOnly;
	}
	let sorted = false;
	if ('sortedSignals' in req.query) {
		sorted = req.query.sortedSignals;
	}
	const slug = req.query.slug;
	const fetch = async () => {
		try {
			const result = await fetchAllSignalsInTheEnv(slug, sorted, true);
			res.status(200).json(result);
		} catch (err) {
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			} else {
				res.status(500).json({ message: 'неизвестная ошибка' });
			}
		}
	};
	fetch();
}
