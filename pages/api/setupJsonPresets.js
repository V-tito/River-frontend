export default async function handler(req, res) {
	const command = req.body;
	let api;
	if ('pulseTime' in command) {
		api = new URL(`${process.env.API_URL}/api/river/v1/protocol/presetPulse`);
		api.searchParams.set('name', command.signal);
		api.searchParams.set('pulseTime', command.pulseTime);
		if ('period' in command) api.searchParams.set('period', command.period);
		else throw new Error('Не задан период импульстной последовательности');
	} else {
		api = new URL(`${process.env.API_URL}/api/river/v1/protocol/preset`);
	}
	api.searchParams.set('name', command.signal);
	api.searchParams.set('value', command.targetValue);
	try {
		const response = await fetch(api.toString(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		console.log(
			`tried to preset state on api ${api.toString()} with command`,
			command
		);
		if (!response.ok) {
			throw new Error(`Ошибка сети:${response.status}${response.message}`);
		}
		res
			.status(200)
			.json(
				`Уровень сигнала ${command.signal} предустановлен на ${command.targetValue}`
			);
	} catch (err) {
		console.log('error polling ', api);
		console.log(err);
		res.status(500).json(`Ошибка: ${err.message}`);
	}
}
