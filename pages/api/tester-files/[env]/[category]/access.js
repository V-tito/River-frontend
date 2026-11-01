// pages/api/files/[...path].js
import writeFile from 'write-file-atomic';
import fs from 'fs-extra';
import { IncomingForm } from 'formidable';
import path from 'path';

export const config = {
	runtime: 'nodejs',
	api: {
		bodyParser: false, // Disable body parsing to handle file upload
	},
};
const allowedCategories = ['CPbackgrounds', 'tests', 'CPs'];
export default async function handler(req, res) {
	const safeBasePath = path.join(process.cwd(), '../vault'); // Configured server path
	const env = req.query.env;
	if (!env)
		return res.status(400).json({ message: 'Не указано рабочее пространство' });
	const category = req.query.category;
	if (!category)
		return res.status(400).json({ message: 'Не указана категория файлов' });
	if (!allowedCategories.includes(category))
		return res
			.status(400)
			.json({ message: 'Указана неподдерживаемая категория файлов' });
	const filename = req.query.filename ?? '';
	const folder = `${safeBasePath}/${env}/${category}`;
	const fullPath = `${safeBasePath}/${env}/${category}/${filename}`;
	console.debug('configured path in files access', fullPath);
	// Security: Prevent path traversal
	if (!fullPath.startsWith(safeBasePath)) {
		return res.status(403).json({ message: 'Нет доступа' });
	}
	if (req.method == 'POST') {
		try {
			fs.ensureDir(folder);
			console.debug('started processing form');
			/*const data = await req.arrayBuffer();
				await writeFile(fullPath, data);*/
			const form = new IncomingForm();
			console.debug('inited form');
			form.keepExtensions = true;
			console.debug('inited form extensions');
			form.on('fileBegin', (formName, file) => {
				// accessible here
				// formName the name in the form (<input name="thisname" type="file">) or http filename for octetstream
				// file.originalFilename http filename or null if there was a parsing error
				// file.newFilename generated hexoid or what options.filename returned
				// file.filepath default pathname as per options.uploadDir and options.filename
				// file.filepath = CUSTOM_PATH // to change the final path
				file.newFilename = 'rivertmp' + crypto.randomUUID();
				file.filepath = path.join(folder, file.newFilename);
			});
			const [fields, files] = await form.parse(req);
			console.debug('no err parsing');
			console.debug('files', files.file);

			// Move the file to the desired location
			for (const file of files.file) {
				const oldPath = file.filepath;
				console.debug('ol path', oldPath);
				const newPath = path.join(folder, file.originalFilename);
				console.debug('new path', newPath);
				fs.rename(oldPath, newPath, err => {
					if (err) {
						return res.status(500).json({
							message: `Не удалось сохранить файл ${file.originalFilename}`,
						});
					}
				});
			}
			const dir = path.dirname(folder);
			console.debug('dir', dir);
			const dirFd = await fs.open(dir, 'r+');
			await fs.fsync(dirFd);
			await fs.close(dirFd);
			console.debug('renamed');
			return res.status(200).json({ message: 'файл(ы) загружен(ы)' });
		} catch (err) {
			return res
				.status(500)
				.json({ message: err.message ?? 'Не удалось сохранить файл' });
		}
	} else
		try {
			console.debug(
				'files access: trying to readdir at base path in non-post request'
			);
			const envs = await fs.readdir(safeBasePath);
			console.debug('envs', envs);
			if (!envs.includes(env))
				return res
					.status(404)
					.json({ message: 'Несуществующее рабочее пространство' });

			if (req.method == 'GET') {
				console.debug('in get, ensuring folder');
				fs.ensureDir(folder);
				console.debug('ensured folder');
				const stats = await fs.stat(fullPath);
				console.debug('in faccess get, got stats', stats);
				if (stats.isDirectory()) {
					console.debug('in faccess get, stats is dir');
					const files = await fs.readdir(fullPath, { withFileTypes: true });
					console.debug('read files', files);
					const filesFiltered = files.filter(entry => entry.isFile());
					console.debug('filtered files', filesFiltered);
					return res
						.status(200)
						.json({ type: 'directory', files: filesFiltered });
				} else if (stats.isFile()) {
					return res.status(200).json({ type: 'file' });
				} else {
					return res
						.status(404)
						.json({ message: 'Файл не найден или поврежден' });
				}
			}

			if (req.method == 'DELETE') {
				fs.unlinkSync(fullPath);
				return res.status(200).json({ status: 'файл удален' });
			}
		} catch (err) {
			return res
				.status(500)
				.json({ message: err.message ?? 'Не удалось сохранить файл' });
		}
	return res.status(405).json({ message: 'Неверный метод' });
	// Upload logic
}
