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
//return;
export default async function handler(req, res) {
	const safeBasePath = path.join(process.cwd(), 'vault'); // Configured server path
	const relativePath = req.query.folder || '';
	const filename = req.query.filename ? req.query.filename : '';
	const fullPath = `${safeBasePath}/${relativePath}/${filename}`;
	if (req.query.envСonfig) {
		const envconf = req.query.envСonfig;
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
	// Security: Prevent path traversal
	if (!fullPath.startsWith(safeBasePath)) {
		return res.status(403).json({ message: 'Нет доступа' });
	}

	try {
		fs.ensureDir(`${safeBasePath}/${relativePath}`);
		if (req.method == 'GET') {
			const stats = await fs.stat(fullPath);
			if (stats.isDirectory()) {
				const files = await fs.readdir(fullPath);
				res.json({ type: 'directory', files });
			} else {
				const content = await fs.readFile(fullPath, 'utf-8');
				res.json({ type: 'file', content });
			}
		}
		if (req.method == 'POST') {
			const form = new IncomingForm();
			form.uploadDir = fullPath; // Directory to save uploaded files
			form.keepExtensions = true;

			form.parse(req, (err, fields, files) => {
				if (err) {
					res.status(500).json({ message: 'Неизвестная ошибка' });
					return;
				}

				// Move the file to the desired location
				const oldPath = files.file[0].filepath;
				const newPath = path.join(
					form.uploadDir,
					files.file[0].originalFilename
				);
				fs.rename(oldPath, newPath, err => {
					if (err) {
						res.status(500).json({ message: 'Не удалось сохранить файл' });
						return;
					}
				});
				res.status(200).json({ message: 'файл загружен' });
			});
		}
		if (req.method == 'DELETE') {
			fs.unlink(fullPath);
			res.status(200).json({ status: 'файл удален' });
		}
		// Upload logic
	} catch (error) {
		res.status(404).json(error.message);
	}
}
