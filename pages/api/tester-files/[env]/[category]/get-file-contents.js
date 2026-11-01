// pages/api/files/[...path].js
import writeFile from 'write-file-atomic';
import fs from 'fs-extra';
import { IncomingForm } from 'formidable';
import path from 'path';
import {
	detectBufferMime,
	detectFileMime,
	detectFilenameMime,
} from 'mime-detect';

export const config = {
	runtime: 'nodejs',
	api: {
		bodyParser: false, // Disable body parsing to handle file upload
	},
};
const allowedCategories = ['CPbackgrounds', 'tests', 'CPs'];
export default async function handler(req, res) {
	console.debug('triggered get-contents endpoint');
	const safeBasePath = path.join(process.cwd(), '../vault'); // Configured server path
	const env = req.query.env;
	if (!env)
		return res.status(400).json({ message: 'Не указано рабочее пространство' });
	const category = req.query.category;
	if (!category)
		return res.status(400).json({ message: 'Не указана категория файлов' });
	console.debug('in get-contents endpoint, env', env, 'category', category);
	if (!allowedCategories.includes(category))
		return res
			.status(400)
			.send({ message: 'Указана неподдерживаемая категория файлов' });
	const filename = req.query.filename ?? '';
	console.debug('in get-contents endpoint, filename', filename);
	const folder = `${safeBasePath}/${env}/${category}`;
	const fullPath = `${safeBasePath}/${env}/${category}/${filename}`;
	// Security: Prevent path traversal
	if (!fullPath.startsWith(safeBasePath)) {
		return res.status(403).send({ message: 'Нет доступа' });
	}
	try {
		fs.ensureDir(safeBasePath);
		const envs = await fs.readdir(safeBasePath);
		if (!envs.includes(env))
			return res
				.status(404)
				.send({ message: 'Несуществующее рабочее пространство' });
		fs.ensureDir(folder);
		console.debug('ensured folder in get-contents');
		if (req.method == 'GET') {
			const stats = await fs.stat(fullPath);
			console.debug('in get-contents, for path', fullPath, 'got stats', stats);
			if (stats.isFile()) {
				console.debug('found file which is file');
				const content = await fs.readFile(fullPath);

				const mime = detectFilenameMime(filename);
				console.debug('mime in get-contents', mime);
				return res.status(200).setHeader('Content-Type', mime).send(content);
			} else {
				return res
					.status(404)
					.send({ message: 'Файл не найден или поврежден' });
			}
		}
	} catch (err) {
		return res
			.status(500)
			.send({ message: err.message ?? 'Не удалось сохранить файл' });
	}
	return res.status(405).send({ message: 'Неверный метод' });
	// Upload logic
}
