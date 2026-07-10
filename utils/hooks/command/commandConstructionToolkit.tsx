import assert from 'node:assert';
import {
	CommandAction,
	Command,
	commandTypeCheckers,
	prototypes,
} from './command';
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
	sigtable: Record<string, Record<string, Array<Record<string, any>>>>
) {
	if (commandTypeCheckers.isSignalCommand(command))
		if (Object.keys(sigtable).includes(command.group))
			if (
				sigtable[command.group].sulSigs.find(
					item => item.name == command.signal
				)
			)
				return { ...command, signalSubtype: 'SulSignal' } as T;
			else if (
				sigtable[command.group].inputs.find(
					item => item.name == command.signal
				) === undefined &&
				sigtable[command.group].outputs.find(
					item => item.name == command.signal
				) === undefined
			)
				return { ...command, signal: '' } as T;
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
	const prototype = prototypes[newAction];
	console.debug('prototype', prototype);
	console.debug('prototype keys', Object.keys(prototype));
	const res = Object.keys(prototype).reduce(
		(acc, key) => {
			console.debug('prototype acc', {
				...acc,
				[key]: prototype[key as keyof typeof prototype],
			});
			return key in command
				? { ...acc, [key]: command[key as keyof typeof command] }
				: { ...acc, [key]: prototype[key as keyof typeof prototype] };
		},
		{ action: newAction, schemeName: command.schemeName }
	);
	return res;
}
function makeNew(
	schemeName: string,
	entry?: Record<string, string | number> | Command
) {
	if (!entry)
		return { action: CommandAction.none, schemeName: schemeName } as Command;
	if (!('action' in entry)) throw new Error('Команда не определена');
	let act = entry.action;
	assert(typeof act == 'string');
	if (!Object.values(CommandAction).includes(act as CommandAction))
		if (!(act in CommandAction)) throw new Error('Неизвестная команда');
		else act = CommandAction[act as keyof typeof CommandAction];
	const newCommand = {
		...entry,
		action: act,
		schemeName: schemeName,
	} as Command;
	return changeAction(newCommand, act as CommandAction);
}
export const CommandConstructionToolkit = {
	makeNew,
	autoClean,
	autoUpdateSignalSubtype,
	updateField,
	changeAction,
};
