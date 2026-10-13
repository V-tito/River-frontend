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

export default async function handler(req, res) {
	const safeBasePath = path.join(process.cwd(), '../vault'); // Configured server path
	const relativePath = req.query.folder ?? '';
	const filename = req.query.filename ?? '';
	const fullPath = `${safeBasePath}/${relativePath}/${filename}`;
	const folder = `${safeBasePath}/${relativePath}`;
	// Security: Prevent path traversal
	if (!fullPath.startsWith(safeBasePath)) {
		return res.status(403).json({ message: 'Нет доступа' });
	}
	try {
		fs.ensureDir(folder);
		if (req.method == 'GET') {
			const stats = await fs.stat(fullPath);
			if (stats.isDirectory()) {
				const files = await fs.readdir(fullPath);
				res.status(200).json({ type: 'directory', files });
			} else {
				const content = await fs.readFile(fullPath, 'utf-8');
				res.status(200).json({ type: 'file', content });
			}
		}
		if (req.method == 'POST') {
			try {
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
				try {
					// Move the file to the desired location
					for (const file of files.file) {
						const oldPath = file.filepath;
						console.debug('ol path', oldPath);
						const newPath = path.join(folder, file.originalFilename);
						console.debug('new path', newPath);
						fs.rename(oldPath, newPath, err => {
							if (err) {
								res.status(500).json({
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
					res.status(200).json({ message: 'файл(ы) загружен(ы)' });
				} catch (err) {
					res.status(500).json({
						message: err.message ?? `Не удалось сохранить файл`,
					});
				}
			} catch (err) {
				res
					.status(500)
					.json({ message: err.message ?? 'Не удалось сохранить файл' });
			}
		}
		if (req.method == 'DELETE') {
			fs.unlinkSync(fullPath);
			res.status(200).json({ status: 'файл удален' });
		}
		// Upload logic
	} catch (error) {
		res.status(404).json(error.message);
	}
}
