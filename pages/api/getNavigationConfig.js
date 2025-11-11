import config from './navigation_config.json';

export default function handler(req, res) {
  res.status(200).json(config.pages);
}