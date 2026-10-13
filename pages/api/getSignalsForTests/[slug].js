import {
	fetchAllSignalsInTheEnv,
	fetchOutputsOfAllBoards,
} from '@/utils/api_wrap/dataProcessingHelpers/getHelpers';
export default function handler(req, res) {
	const slug = req.query.slug; //schemeName

	const fetch = async () => {
		try {
			const byGroup = await fetchAllSignalsInTheEnv(
				slug,
				true //sort signals into inputs and outputs
			);
			console.debug('got beGroup in getForTests');
			const byBoard = await fetchOutputsOfAllBoards(slug, false); //false goes for if it's sul
			console.debug('got byBoard in getForTests');
			const result = { byGroup, byBoard };
			console.debug('made result in sigs for tests');
			res.status(200).json(result);
		} catch (err) {
			console.debug('error in sigs for tests', err);
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
			} else {
				res.status(500).json({ message: 'неизвестная ошибка' });
			}
		}
	};
	fetch();
}
