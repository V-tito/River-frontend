// pages/api/files/[...path].js
import fs from 'fs-extra';

export default async function handler(req, res) {
	const safeBasePath = 'vault'; // Configured server path
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
			fs.writeFile(fullPath, req.body.content);
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
