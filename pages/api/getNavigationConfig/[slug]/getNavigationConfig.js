import config from './navigation_config.json';

export default function handler(req, res) {
	const { slug } = req.query;
	const conf = {
		common: [...config[slug].common, ...config['shared'].common],
		schemeDependent: [
			...config[slug].schemeDependent,
			...config['shared'].schemeDependent,
		],
	};
	res.status(200).json(conf);
}
