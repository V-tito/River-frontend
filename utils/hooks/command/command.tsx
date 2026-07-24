export enum CommandAction {
	include = 'Выполнить скрипт',
	waitForSignal = 'Ждать состояния сигнала',
	waitForTime = 'Бездействовать заданное время',
	check = 'Сравнить состояние сигнала',
	set = 'Установить сигнал',
	setPulse = 'Установить пульсацию',
	preset = 'Предустановить сигнал',
	presetPulse = 'Предустановить пульсацию',
	executePresets = 'Запустить предустановленные',
	none = 'Выберите команду',
	setAll = 'Установить все',
	presetAll = 'Предустановить все',
}

interface BaseCommand {
	id: string | undefined;
	action: CommandAction;
	schemeName: string;
}
export interface SignalCommand extends BaseCommand {
	group: string;
	signal: string;
	signalSubtype: 'Signal' | 'SulSignal';
}
interface CheckSignalCommand extends SignalCommand {
	action: CommandAction.check | CommandAction.waitForSignal;
	expectedValue: number;
	fatal: boolean;
}
export interface SetSignalCommand extends SignalCommand {
	action:
		| CommandAction.set
		| CommandAction.preset
		| CommandAction.setPulse
		| CommandAction.presetPulse;
	targetValue: number;
}
interface WaitForTimeCommand extends BaseCommand {
	action: CommandAction.waitForTime;
	waitingTime: number | string;
}
interface WaitForSignalCommand extends CheckSignalCommand {
	action: CommandAction.waitForSignal;
	waitingTime: number | string;
}
export interface PulseCommand extends SetSignalCommand {
	action: CommandAction.setPulse | CommandAction.presetPulse;
	pulseTime: number;
	period: number;
}

interface IncludeCommand extends BaseCommand {
	action: CommandAction.include;
	scriptPath: string | null;
	scriptContent: any;
}
interface ExecPresetsCommand extends BaseCommand {
	action: CommandAction.executePresets;
}
export interface SetAllCommand extends BaseCommand {
	action: CommandAction.setAll | CommandAction.presetAll;
	targetValue: number;
	board: string;
}
export type Command =
	| BaseCommand
	| CheckSignalCommand
	| SetSignalCommand
	| WaitForTimeCommand
	| WaitForSignalCommand
	| PulseCommand
	| IncludeCommand
	| ExecPresetsCommand
	| SetAllCommand;

const isCheck = (command: Command): command is CheckSignalCommand =>
	command.action === CommandAction.check;
const isSet = (command: Command): command is SetSignalCommand =>
	[CommandAction.set, CommandAction.preset].includes(command.action);
const isWaitForSignal = (command: Command): command is WaitForSignalCommand =>
	command.action === CommandAction.waitForSignal;
const isWaitForTime = (command: Command): command is WaitForTimeCommand =>
	command.action === CommandAction.waitForTime;
const isPulse = (command: Command): command is PulseCommand =>
	[CommandAction.setPulse, CommandAction.presetPulse].includes(command.action);
const isInclude = (command: Command): command is IncludeCommand =>
	command.action === CommandAction.include;
const isExec = (command: Command): command is ExecPresetsCommand =>
	command.action === CommandAction.executePresets;
const isSetAll = (command: Command): command is SetAllCommand =>
	[CommandAction.setAll, CommandAction.presetAll].includes(command.action);
const isSignalCommand = (command: Command): command is SignalCommand =>
	isCheck(command) ||
	isWaitForSignal(command) ||
	isSet(command) ||
	isPulse(command);

export const prototypes = {
	[CommandAction.include]: { scriptPath: '', scriptContent: {} },
	[CommandAction.waitForSignal]: {
		group: '',
		signal: '',
		signalSubtype: 'Signal',
		expectedValue: 0,
		fatal: false,
		waitingTime: 1000,
	},
	[CommandAction.waitForTime]: {
		waitingTime: 1000,
	},
	[CommandAction.check]: {
		group: '',
		signal: '',
		signalSubtype: 'Signal',
		expectedValue: 0,
		fatal: false,
	},
	[CommandAction.set]: {
		group: '',
		signal: '',
		signalSubtype: 'Signal',
		targetValue: 0,
	},
	[CommandAction.setPulse]: {
		group: '',
		signal: '',
		signalSubtype: 'Signal',
		targetValue: 0,
		pulseTime: 500,
		period: 500,
	},
	[CommandAction.preset]: {
		group: '',
		signal: '',
		signalSubtype: 'Signal',
		targetValue: 0,
	},
	[CommandAction.presetPulse]: {
		group: '',
		signal: '',
		signalSubtype: 'Signal',
		targetValue: 0,
		pulseTime: 500,
		period: 500,
	},
	[CommandAction.executePresets]: {},
	[CommandAction.none]: {},
	[CommandAction.setAll]: { targetValue: 0, board: '' },
	[CommandAction.presetAll]: { targetValue: 0, board: '' },
};
export const commandTypeCheckers = {
	isCheck,
	isSet,
	isWaitForTime,
	isWaitForSignal,
	isPulse,
	isInclude,
	isExec,
	isSetAll,
	isSignalCommand,
};
