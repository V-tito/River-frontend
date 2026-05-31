// pages/api/files/[...path].js
import fs from 'fs-extra';
import { IncomingForm } from 'formidable';
import path from 'path';
import { getList } from '@/utils/api_wrap/configAPI';
import { Builder } from 'xml2js';
import { fetchAllSignalsInTheEnv } from '@/utils/hooks/getHelpers';

export const config = {
	runtime: 'nodejs',
	api: {
		bodyParser: false, // Disable body parsing to handle file upload
	},
};
const processEnvConfig = async envName => {
	console.log('envname', envName);

	const res = {};
	try {
		//fetch env
		console.log('began fetching env');
		res.Env = {};

		const schemes = await getList('Scheme');
		console.log('env fetchschemes', schemes);
		console.log(
			schemes.find(item => {
				console.log('item', item);
				console.log('envname', envName);
				return item.name == envName;
			})
		);
		const scheme = schemes.find(item => item.name == envName);
		delete scheme.id;
		res.Env.$ = scheme;
		console.log('set scheme');
		//fetch groups
		const groups = await getList('GroupOfSignals', envName);
		res.Env.Groups = [{ GroupOfSignals: [] }];
		groups.map(item => {
			console.log('iterating groups');
			if ('id' in item) delete item.id;
			res.Env.Groups[0].GroupOfSignals.push({ $: item });
		});
		console.log('fetched groups');
		//fetch tbs
		const boards = await getList('TestBoard', envName);
		res.Env.TestBoards = [{ TestBoard: [] }];
		boards.map(item => {
			if ('id' in item) delete item.id;
			res.Env.TestBoards[0].TestBoard.push({ $: item });
		});
		console.log('fetched boards');
		//fetch sul
		const Sul = await getList('Sul', envName);
		console.log('Sul', Sul, Sul != null);
		if (Sul != null) delete Sul.id;
		res.Env.Sul = [{ $: Sul }];
		console.log('fetched sul');
		//fetch sigs
		const sigs = await fetchAllSignalsInTheEnv(envName, false, false, false);
		res.Env.TestSignals = [{}];
		if ('list' in sigs)
			res.Env.TestSignals[0].Signal = sigs.list.reduce((acc, item) => {
				console.log('sigs entry', item, {
					...item,
					testBoard: item.testBoard.name,
				});
				if ('id' in item) delete item.id;

				return [...acc, { $: { ...item, testBoard: item.testBoard.name } }];
			}, []);
		else res.Env.TestSignals[0].Signal = [];
		console.log('fetched sigs');
		//fetch Sulsigs
		const Sulsigs = await fetchAllSignalsInTheEnv(envName, false, false, true);
		res.Env.SulSignals = [{}];
		console.log('ss', Sulsigs);
		if ('list' in Sulsigs) {
			res.Env.SulSignals[0].SulSignal = Sulsigs.list.reduce((acc, item) => {
				if ('id' in item) delete item.id;
				return [...acc, { $: item }];
			}, []);
		} else res.Env.SulSignals[0].SulSignal = [];
		console.log('conf', res);
	} catch (err) {
		console.log('err in envcfg', err);
	}
	return res;
};
//return;
export default async function handler(req, res) {
	const safeBasePath = path.join(process.cwd(), 'vault'); // Configured server path
	console.log('base path', safeBasePath);
	const relativePath = req.query.folder || '';
	const filename = req.query.filename ? req.query.filename : '';
	console.log(typeof relativePath);
	const fullPath = `${safeBasePath}/${relativePath}/${filename}`;
	console.log(fullPath);
	if (req.query.envСonfig) {
		console.log('envconfig', req.query.envСonfig);
		const envconf = req.query.envСonfig;
		try {
			console.log(envconf);
			const result = await processEnvConfig(envconf);
			console.log('retconF', result);
			var builder = new Builder();
			var xml;
			try {
				xml = builder.buildObject(result);
			} catch (err) {
				console.log(error);
				console.log(err);
			}
			console.log(xml);
			res.status(200).json({ content: xml });
			return;
		} catch (err) {
			console.log('errs', err);
			console.log('errmes', err.message);
			if (err instanceof Error) {
				res.status(500).json({ message: err.message ? err.message : err });
			} else {
				res.status(500).json({ message: 'Неизвестная ошибка' });
			}
		}
	}
	// Security: Prevent path traversal
	if (!fullPath.startsWith(safeBasePath)) {
		return res.status(403).json({ message: 'Нет доступа' });
	}

	try {
		fs.ensureDir(`${safeBasePath}/${relativePath}`);
		if (req.method == 'GET') {
			const stats = await fs.stat(fullPath);
			console.log(stats);
			console.log(stats.isDirectory());
			if (stats.isDirectory()) {
				const files = await fs.readdir(fullPath);
				res.json({ type: 'directory', files });
			} else {
				const content = await fs.readFile(fullPath, 'utf-8');
				console.log(content);
				res.json({ type: 'file', content });
			}
		}
		if (req.method == 'POST') {
			console.log('POST method');

			console.log('trying to parse form');
			const form = new IncomingForm();
			console.log('form', form);
			form.uploadDir = fullPath; // Directory to save uploaded files
			form.keepExtensions = true;

			form.parse(req, (err, fields, files) => {
				if (err) {
					res.status(500).json({ message: 'Неизвестная ошибка' });
					return;
				}

				// Move the file to the desired location
				const oldPath = files.file[0].filepath;
				console.log('oldPath', oldPath);
				console.log('files.file.name', files.file[0].originalFilename);
				console.log('files', files);
				const newPath = path.join(
					form.uploadDir,
					files.file[0].originalFilename
				);
				console.log('newPath', newPath);

				fs.rename(oldPath, newPath, err => {
					console.log('trying to rename');
					if (err) {
						res.status(500).json({ message: 'Не удалось сохранить файл' });
						return;
					}
				});
				res.status(200).json({ message: 'файл загружен' });
			});
		}
		if (req.method == 'DELETE') {
			console.log('DELrequest');
			fs.unlink(fullPath);
			res.status(200).json({ status: 'файл удален' });
		}
		// Upload logic
	} catch (error) {
		res.status(404).json(error.message);
	}
}
