export default async function handler(req, res) {
	const command = req.body;
	const act = command.action;
	console.log(command);
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
				throw new Error(
					`Ошибка сети:${
						response.message !== undefined
							? response.message
							: 'неизвестная ошибка'
					}`
				);
			}
			const result = await response.json();
			console.log('received:', result);
			console.log(Boolean(command.targetValue));
			console.log(result.b == command.targetValue);
			if (result.b == Boolean(command.targetValue))
				res
					.status(200)
					.json(
						`Уровень сигнала ${command.signal} равен эталону ${command.targetValue}`
					);
			else
				res
					.status(200)
					.json(
						`Уровень сигнала ${command.signal} НЕ равен эталону ${command.targetValue}`
					);
		} catch (err) {
			console.log('error polling ', api);
			console.log(err);
			res.status(500).json(`Ошибка: ${err.message}`);
		}
	}
	if (act == 'wait') {
		const api = new URL(`${process.env.API_URL}/api/river/v1/protocol/get`);
		api.searchParams.set('name', command.signal);
		while (true) {
			try {
				const response = await fetch(api.toString(), {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				});
				console.log(`tried to get state on api ${api.toString()}`);
				if (!response.ok) {
					throw new Error(`Ошибка сети:${response.status}`);
				}
				const result = await response.json();
				console.log('received:', result);
				if (result.b == command.targetValue)
					res
						.status(200)
						.json(
							`Уровень сигнала ${command.signal} равен эталону ${command.targetValue} в момент времени ${result.a}`
						);
				else continue;
			} catch (err) {
				console.log('error polling ', api);
				console.log(err);
				res.status(500).json(`Ошибка: ${err.message}`);
			}
		}
	}
	if (act == 'set') {
		const api = new URL(`${process.env.API_URL}/api/river/v1/protocol/set`);
		api.searchParams.set('name', command.signal);
		api.searchParams.set('value', command.targetValue);
		try {
			const response = await fetch(api.toString(), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});
			console.log(`tried to set state on api ${api.toString()}`);
			if (!response.ok) {
				throw new Error(`Ошибка сети:${response.status}`);
			}
			res
				.status(200)
				.json(
					`Уровень сигнала ${command.signal} установлен на ${command.targetValue}`
				);
		} catch (err) {
			console.log('error polling ', api);
			console.log(err);
			res.status(500).json(`Ошибка: ${err.message}`);
		}
	}
}
