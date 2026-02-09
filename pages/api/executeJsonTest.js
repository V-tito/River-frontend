export default async function handler(req, res) {
	const netError = response =>
		new Error(
			`Ошибка сети ${response.status}: ${
				response.message !== undefined ? response.message : 'неизвестная ошибка'
			}`
		);
	const postBlock = async (api, message) => {
		try {
			const response = await fetch(api, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});
			if (!response.ok) {
				throw netError(response);
			} else {
				res.status(200).json(message);
			}
		} catch (err) {
			res.status(500).json(err.message);
		}
	};
	function waitTillTimeout(interval = 500, duration = 30000) {
		let timeoutId;
		let elapsedTime = 0;
		const makeRequest = async () => {
			const api = new URL(`${process.env.API_URL}/api/river/v1/protocol/get`);
			api.searchParams.set('name', command.signal);
			try {
				const response = await fetch(api.toString(), {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				});
				console.log(`tried to get state on api ${api.toString()}`);
				if (!response.ok) {
					throw netError(response);
				}
				const result = await response.json();
				console.log('received:', result);
				if (result.b.toString() == command.expectedValue) {
					res
						.status(200)
						.json(
							`Сигнал ${command.signal} ${command.expectedValue ? 'активен' : 'неактивен'} в момент времени ${result.a}`
						);
				} else {
					elapsedTime += interval;
					if (elapsedTime < duration) {
						timeoutId = setTimeout(makeRequest, interval);
					} else {
						console.log('Polling completed');
						res
							.status(200)
							.json(
								`Время ожидания истекло. Сигнал ${command.signal} не принял ожидаемого значения`
							);
					}
				}
			} catch (err) {
				console.log('error polling ', api);
				console.log(err);
				clearTimeout(timeoutId);
				res.status(500).json(err.message);
			}
		};
		makeRequest();

		// Return function to manually stop
		return () => {
			clearTimeout(timeoutId);
			console.log('Polling stopped manually');
		};
	}
	const command = req.body;
	const act = command.action;
	const postCommands = [
		'preset',
		'presetPulse',
		'set',
		'setPulse',
		'executePresets',
	];
	console.log(command);
	let api;
	let message;
	if (postCommands.includes(act)) {
		if (act == 'executePresets') {
			api = new URL(
				`${process.env.API_URL}/api/river/v1/protocol/executePresets`
			);
			message = 'Запущены пресеты';
		} else {
			if (act == 'preset') {
				api = new URL(`${process.env.API_URL}/api/river/v1/protocol/preset`);
				api.searchParams.set('name', command.signal);
				api.searchParams.set('value', command.targetValue);
				message = `Уровень сигнала ${command.signal} предустановлен на ${command.targetValue}`;
			}
			if (act == 'presetPulse') {
				api = new URL(
					`${process.env.API_URL}/api/river/v1/protocol/presetPulse`
				);
				api.searchParams.set('name', command.signal);
				api.searchParams.set('value', command.targetValue);
				api.searchParams.set('pulseTime', command.pulseTime);
				api.searchParams.set('period', command.period);
				message = `Предустановлен импульс сигнала ${command.signal} значением ${command.targetValue} длиной ${command.pulseTime} периодичностью ${command.period}`;
			}
			if (act == 'set') {
				api = new URL(`${process.env.API_URL}/api/river/v1/protocol/set`);
				api.searchParams.set('name', command.signal);
				api.searchParams.set('value', command.targetValue);
				message = `Уровень сигнала ${command.signal} установлен на ${command.targetValue}`;
			}
			if (act == 'setPulse') {
				api = new URL(`${process.env.API_URL}/api/river/v1/protocol/setPulse`);
				api.searchParams.set('name', command.signal);
				api.searchParams.set('value', command.targetValue);
				api.searchParams.set('pulseTime', command.pulseTime);
				api.searchParams.set('period', command.period);
				message = `Создан импульс сигнала ${command.signal} значением ${command.targetValue} длиной ${command.pulseTime} периодичностью ${command.period}`;
			}
		}
		await postBlock(api, message);
	}
	if (act == 'check') {
		const api = new URL(`${process.env.API_URL}/api/river/v1/protocol/get`);
		api.searchParams.set('name', command.signal);
		try {
			const response = await fetch(api.toString(), {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});
			console.log(`tried to get state on api ${api.toString()}`);
			if (!response.ok) {
				throw netError(response);
			}
			const result = await response.json();
			console.log('received:', result);
			if (result.b == Boolean(command.expectedValue))
				res
					.status(200)
					.json(
						`Уровень сигнала ${command.signal} равен эталону ${command.expectedValue}`
					);
			else
				res
					.status(200)
					.json(
						`Уровень сигнала ${command.signal} НЕ равен эталону ${command.expectedValue}`
					);
		} catch (err) {
			console.log('error polling ', api);
			console.log(err);
			res.status(500).json(err.message);
		}
	}
	if (act == 'wait') {
		waitTillTimeout(500, command.timeout);
	}
}
