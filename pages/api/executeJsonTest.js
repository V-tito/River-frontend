import * as protocol from '@/lib/api_wrap/protocol';
export default async function handler(req, res) {
	async function waitTillTimeout(interval = 500, duration = 30000) {
		let timeoutId;
		let elapsedTime = 0;
		const makeRequest = async () => {
			try {
				const result = await protocol.getSignalState(
					command.group,
					command.signal
				);
				console.log('received:', result);
				if (result.value == command.expectedValue) {
					res
						.status(200)
						.json(
							`Сигнал ${command.signal} ${command.expectedValue ? 'активен' : 'неактивен'} в момент времени ${result.freshness}`
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
				console.log(err);
				clearTimeout(timeoutId);
				res.status(500).json(err.message);
			}
		};
		await makeRequest();

		// Return function to manually stop
		return () => {
			clearTimeout(timeoutId);
			console.log('Polling stopped manually');
		};
	}
	const command = req.body;
	const act = command.action;
	console.log(command);
	let message;
	if (act == 'executePresets') {
		message = 'Запущены пресеты';
		try {
			await protocol.executePresets();
			res.status(200).json(message);
		} catch (err) {
			res.status(500).json(err.message);
		}
	} else {
		if (act == 'preset') {
			message = `Уровень сигнала ${command.signal} предустановлен на ${command.targetValue}`;
			try {
				await protocol.presetSignalState(
					command.group,
					command.signal,
					command.targetValue
				);
				res.status(200).json(message);
			} catch (err) {
				res.status(500).json(err.message);
			}
		}
		if (act == 'presetPulse') {
			message = `Предустановлен импульс сигнала ${command.signal} значением ${command.targetValue} 
			длиной ${command.pulseTime} периодичностью ${command.period}`;
			try {
				await protocol.presetPulse(
					command.group,
					command.signal,
					command.targetValue,
					command.pulseTime,
					command.period
				);
				res.status(200).json(message);
			} catch (err) {
				res.status(500).json(err.message);
			}
		}
		if (act == 'set') {
			message = `Уровень сигнала ${command.signal} установлен на ${command.targetValue}`;
			try {
				await protocol.setSignalState(
					command.group,
					command.signal,
					command.targetValue
				);
				res.status(200).json(message);
			} catch (err) {
				res.status(500).json(err.message);
			}
		}
		if (act == 'setPulse') {
			message = `Создан импульс сигнала ${command.signal} значением ${command.targetValue} длиной ${command.pulseTime} периодичностью ${command.period}`;
			try {
				await protocol.setPulse(
					command.group,
					command.signal,
					command.targetValue,
					command.pulseTime,
					command.period
				);
				res.status(200).json(message);
			} catch (err) {
				res.status(500).json(err.message);
			}
		}
	}

	if (act == 'check') {
		try {
			const result = await protocol.getSignalState(
				command.group,
				command.signal
			);
			console.log('received:', result);
			if (result.value == command.expectedValue)
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
			console.log('error polling ');
			console.log(err);
			res.status(500).json(err.message);
		}
	}
	if (act == 'wait') {
		await waitTillTimeout(500, command.timeout);
	}
}
