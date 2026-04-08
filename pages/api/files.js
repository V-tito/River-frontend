// pages/api/files/[...path].js
import fs from 'fs-extra';
import { IncomingForm } from 'formidable';
import path from 'path';
import { getList } from '@/lib/api_wrap/configAPI';
import { fetchAllSignalsInTheEnv } from '@/lib/hooks/getHelpers';

export const config = {
	runtime: 'nodejs',
	api: {
		bodyParser: false, // Disable body parsing to handle file upload
	},
};
const processEnvConfig = async envName => {
	console.log('envname', envName);
	const translateEntry = entry => {
		const dictionary = {
			name: 'Имя',
			comPort: 'COM_порт',
			description: 'Описание',
			address: 'Адрес',
			maxInputs: 'Число_входных_портов',
			maxOutputs: 'Число_выходов',
			protocolVersion: 'Версия_протокола',
			parentGroup: 'Группа',
			testBoard: 'Плата',
			channel: 'Канал',
			isOutput: 'Сигнал_исходящий',
			isStraight: 'Сигнал_инвертированный',
			turnedOnStatusName: 'Имя_активного_состояния',
			turnedOffStatusName: 'Имя_неактивного_состояния',
			parentSul: 'СУЛ',
			byteShift: 'Сдвиг_в_байтах',
			firstBit: 'Первый_бит',
			lastBit: 'Последний_бит',
		};
		console.log('entry', entry);
		if (typeof entry == Object)
			return Object.keys(entry).reduce((acc, key) => {
				if (key in dictionary) {
					const val =
						key == 'isOutput'
							? entry.key
								? 'да'
								: 'нет'
							: key == 'isStraight'
								? entry.key
									? 'нет'
									: 'да'
								: entry.key;
					return { ...acc, [dictionary[key]]: val };
				}
			}, {});
		else return {};
	};
	const res = {};
	//fetch env
	const schemes = await getList('Scheme');
	console.log('schemes', schemes);
	console.log(
		schemes.find(item => {
			console.log('item', item);
			console.log('envname', envName);
			return item.name == envName;
		})
	);
	const scheme = schemes.find(item => item.name == envName);
	res.Рабочее_пространство = translateEntry(scheme);
	//fetch groups
	const groups = await getList('GroupOfSignals', envName);
	res.Группы = groups.map(translateEntry);
	//fetch tbs
	const boards = await getList('TestBoard', envName);
	res.Тестовые_платы = boards.map(translateEntry);
	//fetch sul
	const sul = await getList('Sul', envName);
	res.СУЛ = translateEntry(sul);
	//fetch sigs
	const sigs = await fetchAllSignalsInTheEnv(envName, false, false, false);
	res.Сигналы = Object.values(sigs.data)
		.reduce((acc, item) => {
			console.log('sigs entry', item);
			return [...acc, ...item];
		}, [])
		.map(translateEntry);
	//fetch sulsigs
	const sulsigs = await fetchAllSignalsInTheEnv(envName, false, false, true);
	res.Сигналы = Object.values(sulsigs.data)
		.reduce((acc, item) => {
			return [...acc, ...item];
		}, [])
		.map(translateEntry);
	console.log('conf', res);
	return res;
	//return
};
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
			res.status(200).json({ content: JSON.stringify(result) });
			return;
		} catch (err) {
			console.log('errs');
			if (err instanceof Error) {
				res.status(500).json({ message: err.message });
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
