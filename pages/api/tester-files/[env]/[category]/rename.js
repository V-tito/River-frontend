import fs from 'fs-extra';
import { IncomingForm } from 'formidable';
import path from 'path';
const allowedCategories = ['CPbackgrounds', 'tests', 'CPs'];
export default async function handler(req, res) {
	try {
		const safeBasePath = path.join(process.cwd(), '../vault'); // Configured server path
		const env = req.query.env;
		if (!env)
			return res
				.status(400)
				.json({ message: 'Не указано рабочее пространство' });
		const category = req.query.category;
		if (!category)
			return res.status(400).json({ message: 'Не указана категория файлов' });
		if (!allowedCategories.includes(category))
			return res
				.status(400)
				.json({ message: 'Указана неподдерживаемая категория файлов' });
		const folder = `${safeBasePath}/${env}/${category}`;
		const oldName = req.query.oldName ?? '';
		const oldPath = `${folder}/${oldName}`;
		const newName = req.query.newName ?? '';
		const newPath = `${folder}/${newName}`;
		// Security: Prevent path traversal
		console.debug('triggered endpoint');
		if (!oldPath.startsWith(safeBasePath)) {
			return res.status(403).json({ message: 'Нет доступа' });
		}

		if (req.method == 'POST') {
			fs.ensureDir(folder);
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
