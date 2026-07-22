import assert from 'node:assert';
import {
	CommandAction,
	Command,
	commandTypeCheckers,
	prototypes,
} from './command';
import { sigtableEntry } from '../entryTypes';
function autoClean<T extends Command>(
	command: T,
	sigtable: Record<string, Record<string, Array<Record<string, any>>>>
) {
	if (commandTypeCheckers.isSignalCommand(command))
		if (!Object.keys(sigtable).includes(command.group))
			return { ...command, group: '', signal: '' };
	return command;
}
function autoUpdateSignalSubtype<T extends Command>(
	command: T,
	sigtable: Record<string, sigtableEntry>
) {
	if (commandTypeCheckers.isSignalCommand(command))
		if (Object.keys(sigtable).includes(command.group)) {
			const signalsOfGroup = sigtable[command.group];
			if (signalsOfGroup == undefined)
				throw new Error(
					`Не удалось получить список сигналов группы ${command.group}`
				);
			if (signalsOfGroup.sulSigs.find(item => item.name == command.signal))
				return { ...command, signalSubtype: 'SulSignal' } as T;
			else if (
				(signalsOfGroup.outputs.find(item => item.name == command.signal) ===
					undefined &&
					(commandTypeCheckers.isSet(command) ||
						commandTypeCheckers.isPulse(command))) ||
				(signalsOfGroup.inputs.find(item => item.name == command.signal) ===
					undefined &&
					commandTypeCheckers.isCheck(command))
			)
				return { ...command, signal: '' } as T;
		}
	return command;
}
function updateField<T extends Command, K extends keyof T>(
	command: T,
	field: K,
	value: string | number | boolean
) {
	if (field in command) {
		const val = value as T[K];
		const newCommand = { ...command, [field]: val };
		return newCommand as T;
	}
	return command;
}
function changeAction<T extends Command>(command: T, newAction: CommandAction) {
	console.debug(
		'started changing action/copying prototype values to command',
		command
	);
	const prototype = prototypes[newAction];
	const res = Object.keys(prototype).reduce(
		(acc, key) => {
			return key in command
				? { ...acc, [key]: command[key as keyof typeof command] }
				: { ...acc, [key]: prototype[key as keyof typeof prototype] };
		},
		{
			action: newAction,
			schemeName: command.schemeName,
			id: typeof command.id == 'string' ? crypto.randomUUID() : command.id,
		}
	);
	console.debug('command after changing action/copying prototype values', res);
	return res;
}
function makeNew(
	schemeName: string,
	entry?: Record<string, string | number> | Command
) {
	console.debug('started creating new command');
	if (!entry) {
		return {
			action: CommandAction.none,
			schemeName: schemeName,
			id: crypto.randomUUID(),
		} as Command;
	}
	if (!('action' in entry)) throw new Error('Команда не определена');
	let act = entry.action;
	assert(typeof act == 'string');
	if (!Object.values(CommandAction).includes(act as CommandAction))
		if (!(act in CommandAction))
			if (act == 'wait')
				if ('signal' in entry) act = CommandAction.waitForSignal;
				else act = CommandAction.waitForTime;
			else throw new Error('Неизвестная команда');
		else act = CommandAction[act as keyof typeof CommandAction];
	const newCommand = {
		...entry,
		action: act,
		schemeName: schemeName,
		id: typeof entry.id == 'string' ? entry.id : crypto.randomUUID(),
	} as Command;
	console.debug('new command before copying prototype values', newCommand);
	return changeAction(newCommand, act as CommandAction);
}

export const CommandConstructionToolkit = {
	makeNew,
	autoClean,
	autoUpdateSignalSubtype,
	updateField,
	changeAction,
};
