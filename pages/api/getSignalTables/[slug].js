import { fetchAllSignalsInTheEnv } from '@/utils/hooks/getHelpers';
export default function handler(req, res) {
	let sorted = false;
	let namesOnly = false;
	if ('sortedSignals' in req.query) {
		sorted = req.query.sortedSignals;
	}
	if ('namesOnly' in req.query) {
		namesOnly = req.query.namesOnly;
	}
	const slug = req.query.slug; //schemeName

	const fetch = async () => {
		try {
			const result = await fetchAllSignalsInTheEnv(
				slug,
				sorted,
				namesOnly,
				false
			);
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
