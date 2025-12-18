import config from './addConfig.json';

export default function handler(req, res) {
	const { slug } = req.query;
	res.status(200).json(config[slug]);
	console.log(slug);
}
