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
function hasEmptyFields(command: Command) {
	let res = command.action == CommandAction.none;
	console.debug(
		'triggered has empty with command',
		command,
		'command.action == CommandAction.none:',
		res
	);
	if (commandTypeCheckers.isSignalCommand(command))
		res = res || command.group == '' || command.signal == '';
	if (commandTypeCheckers.isInclude(command))
		res = res || command.scriptPath == '';
	console.debug('returning', res, ' from has empty with command', command);
	return res;
}
async function preprocess<T extends Command>(command: T, index: number) {
	if (
		commandTypeCheckers.isWaitForSignal(command) ||
		commandTypeCheckers.isWaitForTime(command)
	) {
		let res: string;
		if (commandTypeCheckers.isWaitForSignal(command))
			res = `Ждем, пока сигнал ${command.signal} не станет ${command.expectedValue ? 'активен' : 'неактивен'}`;
		else res = 'Ожидание...';

		const now = new Date();
		return {
			res: res,
			timestamp: now.toLocaleTimeString(),
			actionType: 'checker',
			id: index,
		};
	} else if (commandTypeCheckers.isInclude(command)) {
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
	if (
		!(
			commandTypeCheckers.isCheck(command) ||
			commandTypeCheckers.isWaitForSignal(command)
		)
	)
		throw new Error('Неверный тип команды');
	if (command.signalSubtype == 'Signal') {
		console.debug(
			'expected value ',
			command.expectedValue,
			'of type',
			typeof command.expectedValue,
			'is == result.value',
			command.expectedValue == result.value,
			'of type ',
			typeof result.value
		);
		return command.expectedValue == 0
			? result.value == command.expectedValue
			: result.value > 0;
	} else return result.value == command.expectedValue;
};

async function waitForSignalState(
	command: Command,
	interval = 500,
	duration = 30000
) {
	if (!commandTypeCheckers.isWaitForSignal(command))
		throw new Error('Неверный тип команды');
	let result: Record<string, any> = {};
	let cond: boolean = false;
	let error: any = null;
	const dur = command.waitingTime ? (command.waitingTime as number) : duration;
	let elapsedTime = 0;
	const makeRequest = async () => {
		console.debug('duraiton', dur);
		result = await protocol.getSignalState(
			command.schemeName,
			command.group,
			command.signal
		);
		console.log('received:', result);
		cond = checkExpected(command, result);
	};
	while (elapsedTime < dur && !cond) {
		try {
			await makeRequest();
			elapsedTime += interval;
			await new Promise(res => setTimeout(res, interval));
		} catch (err) {
			console.log('caught error');
			error = err;
			break;
		}
	}
	if (error != null) throw error;

	if (cond) {
		assert(result.freshness);
		return `Сигнал ${command.signal} ${command.expectedValue ? 'активен' : 'неактивен'} в момент времени ${result.freshness}`;
	} else if (elapsedTime >= dur)
		return `Время ожидания истекло. Сигнал ${command.signal} не принял ожидаемого значения`;
	else return 'Ошибка исполнения';
}

async function execute<T extends Command>(command: T, index: number) {
	console.debug('Executing entry', command);
	let message;
	if (commandTypeCheckers.isSignalCommand(command)) {
		console.debug('entry is signal command', command);
		const exists = await checkExistence(
			command.signalSubtype,
			command.signal,
			command.group,
			command.schemeName
		);
		console.debug(
			'entry &signal existence before nonexistent signal throw',
			command,
			exists
		);
		if (!exists) throw new Error('Несуществующий сигнал');
		console.debug(
			'entry & signal existence after throw statement',
			command,
			exists
		);
		if (commandTypeCheckers.isSet(command)) {
			console.debug('entry is set/preset command');
			switch (command.action as CommandAction) {
				case CommandAction.set:
					console.debug('preparing ng to send set command');
					message = `Уровень сигнала ${command.signal} установлен на ${command.targetValue}`;
					await protocol.setSignalState(
						command.schemeName,
						command.group,
						command.signal,
						command.targetValue
					);
					break;
				case CommandAction.preset:
					console.debug('preparing to send preset command');
					message = `Уровень сигнала ${command.signal} предустановлен на ${command.targetValue}`;
					await protocol.presetSignalState(
						command.schemeName,
						command.group,
						command.signal,
						command.targetValue
					);
					break;
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
					break;
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
					break;
			}
		}
		if (commandTypeCheckers.isWaitForSignal(command)) {
			message = await waitForSignalState(command);
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
	if (commandTypeCheckers.isWaitForTime(command)) {
		await new Promise(res => setTimeout(res, command.waitingTime as number));
		message = `Прошло ${command.waitingTime as number} миллисекунд`;
	}
	if (commandTypeCheckers.isSetAll(command)) {
		switch (command.action) {
			case CommandAction.setAll:
				message = `Сигналы платы ${command.board} установлены на ${command.targetValue}`;

				break;
			case CommandAction.presetAll:
				message = `Сигналы платы ${command.board} предустановлены на ${command.targetValue}`;
				break;
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
	hasEmptyFields,
};
