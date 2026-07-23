import assert from 'node:assert';
import type { Command } from '@/utils/hooks/command/command';
import {
	CommandAction,
	commandTypeCheckers,
} from '@/utils/hooks/command/command';
import { CommandBarHelpers } from '../command/commandBarHelpers';
import { checkExistence } from '@/utils/api_wrap/configAPI';
import * as protocol from '@/utils/api_wrap/protocol';
import { netError } from '@/utils/api_wrap/netError';
import { CommandConstructionToolkit } from './commandConstructionToolkit';
export interface Result {
	id: string | undefined;
	actionType: string;
	timestamp: string;
	res: string | undefined;
}
function hasEmptyFields(command: Command) {
	let res = command.action == CommandAction.none;
	if (commandTypeCheckers.isSignalCommand(command))
		res = res || command.group == '' || command.signal == '';
	if (commandTypeCheckers.isInclude(command))
		res = res || command.scriptPath == '';
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
			id: command.id,
		};
	} else if (commandTypeCheckers.isInclude(command)) {
		const now = new Date();
		return {
			res: `Подгружаем скрипт ${command.scriptPath}`,
			timestamp: now.toLocaleTimeString(),
			actionType: 'include',
			id: command.id,
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
		console.debug('triggered check with expectedValue', command.expectedValue, 'equivalency of which to 0 is', command.expectedValue == 0)
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
		result = await protocol.getSignalState(
			command.schemeName,
			command.group,
			command.signal
		);
		cond = checkExpected(command, result);
	};
	while (elapsedTime < dur && !cond) {
		try {
			await makeRequest();
			elapsedTime += interval;
			await new Promise(res => setTimeout(res, interval));
		} catch (err) {
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

async function execute<T extends Command>(
	command: T,
	index: number,
	iterate: CallableFunction
) {
	console.debug('execute command ', command);
	let message;
	let response;
	if (commandTypeCheckers.isSignalCommand(command)) {
		console.debug('command is signal command');
		const exists = await checkExistence(
			command.signalSubtype,
			command.signal,
			command.group,
			command.schemeName
		);
		if (!exists) throw new Error('Несуществующий сигнал');
		console.debug('command has existing signal');
		if (commandTypeCheckers.isSet(command)) {
			console.debug('command is recognized as set or preset');
			switch (command.action as CommandAction) {
				case CommandAction.set:
					console.debug('command is recognized as set');
					message = `Уровень сигнала ${command.signal} установлен на ${command.targetValue}`;
					response = await protocol.setSignalState(
						command.schemeName,
						command.group,
						command.signal,
						command.targetValue
					);
					console.debug(
						'result of protocol.setSignalState execution is ',
						response
					);
					break;
				case CommandAction.preset:
					console.debug('command is recognized as preset');
					message = `Уровень сигнала ${command.signal} предустановлен на ${command.targetValue}`;
					response = await protocol.presetSignalState(
						command.schemeName,
						command.group,
						command.signal,
						command.targetValue
					);
					console.debug(
						'result of protocol.presetSignalState execution is ',
						response
					);
					break;
			}
		}
		if (commandTypeCheckers.isPulse(command)) {
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
					break;
			}
		}
		if (commandTypeCheckers.isWaitForSignal(command)) {
			console.debug('command is recognized as waitForSignalState');
			message = await waitForSignalState(command);
			console.debug('result of waitForSignalState execution is ', message);
		}
		if (commandTypeCheckers.isCheck(command)) {
			console.debug('command is recognized as check');
			const result = await protocol.getSignalState(
				command.schemeName,
				command.group,
				command.signal
			);
			console.debug('result of protocol.getSignalState execution is ', result);
			const cond = checkExpected(command, result);
			console.debug('result of checking for expected value is', cond);
			if (cond)
				message = `Уровень сигнала ${command.signal} равен эталону ${command.expectedValue}`;
			else
				message = `Уровень сигнала ${command.signal} НЕ равен эталону ${command.expectedValue}`;
		}
	}
	if (commandTypeCheckers.isWaitForTime(command)) {
		console.debug('command is recognized as waitForTime');
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
	if (commandTypeCheckers.isInclude(command)) {
		console.debug('command recognized as include');
		const response = await fetch(
			`/api/files?folder=${command.schemeName}&filename=${command.scriptPath}`,
			{
				method: 'GET',
			}
		);
		if (!response.ok) {
			throw netError(response);
		}
		const result = await response.json();
		console.debug(
			'got scriptContent',
			result,
			'parsed would be',
			JSON.parse(result.content)
		);
		command.scriptContent = JSON.parse(result.content);
		for (let i = 0; i < command.scriptContent.length; i++) {
			const content = CommandConstructionToolkit.makeNew(command.schemeName, {
				...command.scriptContent[i],
				id: command.id,
			});
			console.debug(
				'made command',
				content,
				' from loaded entry',
				command.scriptContent[i]
			);
			await iterate(content, index);
		}
		message = `Выполнен скрипт ${command.scriptPath}`;
	}
	const now = new Date();
	return {
		res: message,
		timestamp: now.toLocaleTimeString(),
		actionType: CommandBarHelpers.isSetter(command)
			? 'setter'
			: commandTypeCheckers.isInclude(command)
				? 'include'
				: 'checker',
		id: command.id,
	};
}

export const CommandExecutionToolkit = {
	preprocess,
	execute,
	hasEmptyFields,
};
