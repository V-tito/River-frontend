export enum CommandAction {
	include = 'Выполнить скрипт',
	wait = 'Ждать',
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
	action: CommandAction;
	schemeName: string;
}
interface SignalCommand extends BaseCommand {
	group: string;
	signal: string;
	signalSubtype: 'Signal' | 'SulSignal';
}
interface CheckSignalCommand extends SignalCommand {
	action: CommandAction.check | CommandAction.wait;
	expectedValue: number;
}
interface SetSignalCommand extends SignalCommand {
	action:
		| CommandAction.set
		| CommandAction.preset
		| CommandAction.setPulse
		| CommandAction.presetPulse;
	targetValue: number;
}
interface WaitCommand extends CheckSignalCommand {
	action: CommandAction.wait;
	waitForSignal: boolean;
	waitingTime: number | string;
}
interface PulseCommand extends SetSignalCommand {
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
interface SetAllCommand extends BaseCommand {
	action: CommandAction.setAll;
	targetValue: number;
}
export type Command =
	| BaseCommand
	| CheckSignalCommand
	| SetSignalCommand
	| WaitCommand
	| PulseCommand
	| IncludeCommand
	| ExecPresetsCommand
	| SetAllCommand;

const isCheck = (command: Command): command is CheckSignalCommand =>
	command.action === CommandAction.check;
const isSet = (command: Command): command is SetSignalCommand =>
	[CommandAction.set, CommandAction.preset].includes(command.action);
const isWait = (command: Command): command is WaitCommand =>
	command.action === CommandAction.wait;
const isPulse = (command: Command): command is PulseCommand =>
	[CommandAction.setPulse, CommandAction.presetPulse].includes(command.action);
const isInclude = (command: Command): command is IncludeCommand =>
	command.action === CommandAction.include;
const isExec = (command: Command): command is ExecPresetsCommand =>
	command.action === CommandAction.executePresets;
const isSetAll = (command: Command): command is SetAllCommand =>
	command.action === CommandAction.setAll;
const isSignalCommand = (command: Command): command is SignalCommand =>
	isCheck(command) || isWait(command) || isSet(command) || isPulse(command);

export const prototypes = {
	[CommandAction.include]: { scriptPath: null, scriptContent: {} },
	[CommandAction.wait]: {
		group: '',
		signal: '',
		signalSubtype: 'Signal',
		expectedValue: 0,
		waitForSignal: true,
		waitingTime: 1000,
	},
	[CommandAction.check]: {
		group: '',
		signal: '',
		signalSubtype: 'Signal',
		expectedValue: 0,
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
	[CommandAction.setAll]: { targetValue: 0 },
	[CommandAction.presetAll]: { targetValue: 0 },
};
export const commandTypeCheckers = {
	isCheck,
	isSet,
	isWait,
	isPulse,
	isInclude,
	isExec,
	isSetAll,
	isSignalCommand,
};
