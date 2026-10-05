import fs from 'fs-extra';
import { IncomingForm } from 'formidable';
import path from 'path';

export default async function handler(req, res) {
	try {
		const safeBasePath = path.join(process.cwd(), '../vault'); // Configured server path
		const relativePath = req.query.folder ?? '';
		const oldName = req.query.oldName ?? '';
		const oldPath = `${safeBasePath}/${relativePath}/${oldName}`;
		const newName = req.query.newName ?? '';
		const newPath = `${safeBasePath}/${relativePath}/${newName}`;
		// Security: Prevent path traversal
		console.debug('triggered endpoint');
		if (!oldPath.startsWith(safeBasePath)) {
			return res.status(403).json({ message: 'Нет доступа' });
		}

		fs.ensureDir(`${safeBasePath}/${relativePath}`);
		if (req.method == 'POST') {
			fs.rename(oldPath, newPath, err => {
				if (err) {
					res.status(500).json({ message: 'Не удалось сохранить файл' });
					return;
				}
			});
			res.status(200).json({ message: 'файл переменован' });
		} else {
			res.status(405).json({ message: 'неверный метод' });
		}
		// Upload logic
	} catch (error) {
		console.debug('error', error.message);
		res.status(404).json(error.message);
	}
}
