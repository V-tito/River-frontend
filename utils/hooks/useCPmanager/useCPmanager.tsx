import { editingMode } from './editingMode';
import { testingMode } from './testingMode';

/**
 * Менеджер панелей управления. Возвращает таблицу панелей (react State), react State с именем текущей панели
 *  и набор функций для работы с панелями (отличается в разных режимах)
 * @param envName - имя рабочего пространства
 * @param mode - режим (editing или testing)
 * @returns
 */
export function useCPManager(envName: string, mode: string) {
	if (mode == 'editing') return editingMode(envName);
	else return testingMode(envName);
}
