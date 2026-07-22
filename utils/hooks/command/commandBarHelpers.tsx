import { Command, commandTypeCheckers } from './command';
const translateFields = {
	group: 'Группа',
	signal: 'Сигнал',
	targetValue: 'Целевое значение',
	expectedValue: 'Ожидаемое значение',
	pulseTime: 'Длительность импульса, мс',
	period: 'Периодичность импульсов, мс',
	waitForSignal: 'Ждать состояния сигнала',
	waitingTime: 'Время ожидания, мс',
};
function isSetter<T extends Command>(command: T) {
	return (
		commandTypeCheckers.isSet(command) ||
		commandTypeCheckers.isPulse(command) ||
		commandTypeCheckers.isSetAll(command)
	);
}
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
			].includes(key)
	);
}

export const CommandBarHelpers = {
	translateFields,
	isSetter,
	getConfig,
};
