// pages/api/files/[...path].js
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
	const safeBasePath = path.join(process.cwd(), 'vault'); // Configured server path
	const relativePath = req.query.folder || '';
	const filename = req.query.filename ? req.query.filename : '';
	console.log(typeof relativePath);
	const fullPath = `${safeBasePath}/${relativePath}/${filename}`;
	console.log(fullPath);
	// Security: Prevent path traversal
	if (!fullPath.startsWith(safeBasePath)) {
		return res.status(403).json({ error: 'Access denied' });
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
					res.status(500).json({ error: 'Something went wrong' });
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
						res.status(500).json({ error: 'Error saving the file' });
						return;
					}
				});
				res.status(200).json({ message: 'File uploaded successfully' });
			});
		}
		if (req.method == 'DELETE') {
			console.log('DELrequest');
			fs.unlink(fullPath);
			res.status(200).json({ status: 'deleted successfully' });
		}
		// Upload logic
	} catch (error) {
		res.status(404).json(error.message);
	}
}
