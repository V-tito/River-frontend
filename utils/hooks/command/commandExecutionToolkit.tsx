import assert from 'node:assert';
import { CommandAction, Command, commandTypeCheckers } from './command';
import { CommandBarHelpers } from './commandBarHelpers';
import { checkExistence } from '@/utils/api_wrap/configAPI';
import * as protocol from '@/utils/api_wrap/protocol';
export interface Result {
	id: number;
	actionType: string;
	timestamp: string;
	res: string | undefined;
}

async function preprocess<T extends Command>(command: T, index: number) {
	if (commandTypeCheckers.isWait(command)) {
		const now = new Date();
		return {
			res: command.waitForSignal
				? `Ждем, пока сигнал ${command.signal} не станет ${command.expectedValue ? 'активен' : 'неактивен'}`
				: 'Ожидание...',
			timestamp: now.toLocaleTimeString(),
			actionType: 'checker',
			id: index,
		};
	}
	if (commandTypeCheckers.isInclude(command)) {
		const now = new Date();
		return {
			res: `Подгружаем скрипт ${command.scriptPath}`,
			timestamp: now.toLocaleTimeString(),
			actionType: 'include',
			id: index,
		};
	}
	return;
}
async function postprocess<T extends Command>(
	command: T,
	index: number,
	iterate: CallableFunction
) {
	if (commandTypeCheckers.isInclude(command)) {
		for (let i = 0; i < command.scriptContent.length; i++) {
			const content = command.scriptContent[i];
			await iterate(content, index);
		}
		const now = new Date();
		return {
			res: `Выполнен скрипт ${command.scriptPath}`,
			timestamp: now.toLocaleTimeString(),
			actionType: 'include',
			id: index,
		};
	}
	return;
}

const checkExpected = (command: Command, result: Record<string, any>) => {
	if (!commandTypeCheckers.isCheck(command))
		throw new Error('Неверный тип команды');
	if (command.signalSubtype == 'Signal')
		return command.expectedValue == 0
			? result.value == command.expectedValue
			: result.value > 0;
	else return result.value == command.expectedValue;
};

async function waitForSignalState(
	command: Command,
	interval = 500,
	duration = 30000
) {
	if (!commandTypeCheckers.isWait(command))
		throw new Error('Неверный тип команды');
	let result: Record<string, any> = {};
	let cond: boolean = false;
	let timeoutId: NodeJS.Timeout;
	const dur = command.waitingTime ? (command.waitingTime as number) : duration;
	let elapsedTime = 0;
	const makeRequest = async () => {
		result = await protocol.getSignalState(
			command.schemeName,
			command.group,
			command.signal
		);
		console.log('received:', result);
		cond = checkExpected(command, result);
		if (cond) {
			return `Сигнал ${command.signal} ${command.expectedValue ? 'активен' : 'неактивен'} в момент времени ${result.freshness}`;
		} else {
			elapsedTime += interval;
			if (elapsedTime < dur) {
				timeoutId = setTimeout(makeRequest, interval);
			} else {
				return `Время ожидания истекло. Сигнал ${command.signal} не принял ожидаемого значения`;
			}
		}
	};
	await makeRequest();

	if (cond) {
		assert(result.freshness);
		return `Сигнал ${command.signal} ${command.expectedValue ? 'активен' : 'неактивен'} в момент времени ${result.freshness}`;
	} else if (elapsedTime >= dur)
		return `Время ожидания истекло. Сигнал ${command.signal} не принял ожидаемого значения`;
	else return 'Ошибка исполнения';
}
async function execute<T extends Command>(command: T, index: number) {
	console.debug('entry in execute', command);
	let message;
	if (commandTypeCheckers.isSignalCommand(command)) {
		console.debug('entry is signal command', command);
		const exists = await checkExistence(
			command.signalSubtype,
			command.signal,
			command.group,
			command.schemeName
		);
		console.debug('entry exists before throw', command, exists);
		if (!exists) throw new Error('Несуществующий сигнал');
		console.debug('entry exists', command, exists);
		if (commandTypeCheckers.isSet(command)) {
			console.debug('entry is set');
			switch (command.action as CommandAction) {
				case CommandAction.set:
					message = `Уровень сигнала ${command.signal} установлен на ${command.targetValue}`;
					await protocol.setSignalState(
						command.schemeName,
						command.group,
						command.signal,
						command.targetValue
					);
				case CommandAction.preset:
					message = `Уровень сигнала ${command.signal} предустановлен на ${command.targetValue}`;
					await protocol.presetSignalState(
						command.schemeName,
						command.group,
						command.signal,
						command.targetValue
					);
			}
		}
		if (commandTypeCheckers.isPulse(command)) {
			console.debug('entry is pulse');
			switch (command.action) {
				case CommandAction.setPulse:
					message = `Создан импульс сигнала ${command.signal} значением ${command.targetValue} длиной ${command.pulseTime} периодичностью ${command.period}`;
					await protocol.setPulse(
						command.schemeName,
						command.group,
						command.signal,
						command.targetValue,
						command.pulseTime,
						command.period
					);
				case CommandAction.presetPulse:
					console.debug('triggered preset pulse', command);
					message = `Предустановлен импульс сигнала ${command.signal} значением ${command.targetValue} 
								длиной ${command.pulseTime} периодичностью ${command.period}`;
					await protocol.presetPulse(
						command.schemeName,
						command.group,
						command.signal,
						command.targetValue,
						command.pulseTime,
						command.period
					);
					console.debug('pulse preset', command);
			}
		}
		if (commandTypeCheckers.isWait(command)) {
			if (command.waitForSignal) message = await waitForSignalState(command);
			else {
				await new Promise(res =>
					setTimeout(res, command.waitingTime as number)
				);
				message = `Прошло ${command.waitingTime as number} миллисекунд`;
			}
		}
		if (commandTypeCheckers.isCheck(command)) {
			const result = await protocol.getSignalState(
				command.schemeName,
				command.group,
				command.signal
			);
			const cond = checkExpected(command, result);
			if (cond)
				message = `Уровень сигнала ${command.signal} равен эталону ${command.expectedValue}`;
			else
				message = `Уровень сигнала ${command.signal} НЕ равен эталону ${command.expectedValue}`;
		}
	}
	if (commandTypeCheckers.isExec(command)) {
		message = 'Запущены пресеты';
		await protocol.executePresets(command.schemeName);
	}
	const now = new Date();
	return {
		res: message,
		timestamp: now.toLocaleTimeString(),
		actionType: CommandBarHelpers.isSetter(command) ? 'setter' : 'checker',
		id: index,
	};
}

export const CommandExecutionToolkit = {
	preprocess,
	postprocess,
	execute,
};
