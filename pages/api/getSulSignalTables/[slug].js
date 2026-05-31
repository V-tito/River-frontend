import { fetchAllSignalsInTheEnv } from '@/utils/hooks/getHelpers';
export default function handler(req, res) {
	console.log('triggered endpoint fetch sul sighals');
	let namesOnly = false;
	if ('namesOnly' in req.query) {
		namesOnly = req.query.namesOnly;
	}
	const slug = req.query.slug;
	const fetch = async () => {
		try {
			const result = await fetchAllSignalsInTheEnv(
				slug,
				false,
				namesOnly,
				true
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
