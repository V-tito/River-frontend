import {
	Command,
	SetAllCommand,
	SetSignalCommand,
	PulseCommand,
	commandTypeCheckers,
} from './command';
const translateFields = {
	group: 'Группа',
	signal: 'Сигнал',
	targetValue: 'Целевое значение',
	expectedValue: 'Ожидаемое значение',
	pulseTime: 'Длительность импульса, мс',
	period: 'Периодичность импульсов, мс',
	waitForSignal: 'Ждать состояния сигнала',
	waitingTime: 'Время ожидания, мс',
	numberOfIterations: 'Число повторений',
	board: 'Плата',
};
function isSetter<T extends Command>(command: T) {
	return (
		commandTypeCheckers.isSet(command) ||
		commandTypeCheckers.isPulse(command) ||
		commandTypeCheckers.isSetAll(command)
	);
}
/**
 * filters out the command's attributes that should not be mapped onto commandBar's form fields during dynamic generation
 * @param command the command
 * @returns filtered array of fields
 */
function getConfig<T extends Command>(command: T) {
	return Object.keys(command).filter(
		key =>
			![
				'group',
				'signalSubtype',
				'schemeName',
				'action',
				'scriptContent',
				'id',
				'values',
			].includes(key)
	);
}

export const CommandBarHelpers = {
	translateFields,
	isSetter,
	getConfig,
};
