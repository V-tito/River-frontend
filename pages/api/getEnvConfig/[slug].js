import path from 'path';
import { getList } from '@/utils/api_wrap/configAPI';
import { Builder } from 'xml2js';
import { fetchAllSignalsInTheEnv } from '@/utils/api_wrap/dataProcessingHelpers/getHelpers';
const processEnvConfig = async envName => {
	const res = {};
	try {
		//fetch env
		res.Env = {};
		const schemes = await getList('Scheme');

		const scheme = schemes.find(item => item.name == envName);
		delete scheme.id;
		res.Env.$ = scheme;
		//fetch groups
		const groups = await getList('GroupOfSignals', envName);
		res.Env.Groups = [{ GroupOfSignals: [] }];
		groups.map(item => {
			if ('id' in item) delete item.id;
			res.Env.Groups[0].GroupOfSignals.push({ $: item });
		});
		//fetch tbs
		const boards = await getList('TestBoard', envName);
		res.Env.TestBoards = [{ TestBoard: [] }];
		boards.map(item => {
			if ('id' in item) delete item.id;
			res.Env.TestBoards[0].TestBoard.push({ $: item });
		});
		//fetch sul
		const Sul = await getList('Sul', envName);
		if (Sul != null) delete Sul.id;
		res.Env.Sul = [{ $: Sul }];
		//fetch sigs
		const sigs = await fetchAllSignalsInTheEnv(envName, false, false, false);
		res.Env.TestSignals = [{}];
		if ('list' in sigs)
			res.Env.TestSignals[0].Signal = sigs.list.reduce((acc, item) => {
				if ('id' in item) delete item.id;

				return [...acc, { $: { ...item, testBoard: item.testBoard.name } }];
			}, []);
		else res.Env.TestSignals[0].Signal = [];
		//fetch Sulsigs
		const Sulsigs = await fetchAllSignalsInTheEnv(envName, false, false, true);
		res.Env.SulSignals = [{}];
		if ('list' in Sulsigs) {
			res.Env.SulSignals[0].SulSignal = Sulsigs.list.reduce((acc, item) => {
				if ('id' in item) delete item.id;
				return [...acc, { $: item }];
			}, []);
		} else res.Env.SulSignals[0].SulSignal = [];
	} catch (err) {}
	return res;
};
export default async function handler(req, res) {
	const envconf = req.query.slug;
	try {
		const result = await processEnvConfig(envconf);
		var builder = new Builder();
		var xml;
		try {
			xml = builder.buildObject(result);
		} catch (err) {}
		res.status(200).json({ content: xml });
		return;
	} catch (err) {
		if (err instanceof Error) {
			res.status(500).json({ message: err.message ? err.message : err });
		} else {
			res.status(500).json({ message: 'Неизвестная ошибка' });
		}
	}
}
