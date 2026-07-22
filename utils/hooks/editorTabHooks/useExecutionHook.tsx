import {
	CommandExecutionToolkit,
	Result,
} from '../command/commandExecutionToolkit';
import { EditorTab, addErrorId } from './utils';
import { Command } from '../command/command';
import assert from 'node:assert';

export function useExecutionHook(
	setTabs: React.Dispatch<React.SetStateAction<Record<string, EditorTab>>>,
	currentTabId: string
) {
	const { preprocess, execute, hasEmptyFields } = CommandExecutionToolkit;
	function updateTabResults(id: string | undefined, result: Result) {
		if (id == undefined) throw new Error('Не определен идентификатор вкладки');
		setTabs(prev => {
			if (prev[id] != undefined)
				return {
					...prev,
					[id]: {
						...prev[id],
						result: [...prev[id].result, result],
					} as EditorTab,
				};
			else throw new Error('Несуществующая вкладка');
		});
	}
	function clearTabResults(id: string | undefined) {
		if (id == undefined) throw new Error('Не определен идентификатор вкладки');
		setTabs(prev => {
			return {
				...prev,
				[id]: { ...prev[id], result: [] } as EditorTab,
			};
		});
	}
	function clearTabErrorIds(tabId: string) {
		setTabs(prev => ({
			...prev,
			[tabId]: { ...prev[tabId], errorIDs: [] } as EditorTab,
		}));
	}

	function setCurrentTabErrorIDs(
		updater: (prev: Array<number>) => Array<number>
	) {
		setTabs(prev => {
			if (prev[currentTabId] != undefined)
				return {
					...prev,
					[currentTabId]: {
						...prev[currentTabId],
						errorIDs: updater(prev[currentTabId].errorIDs),
					} as EditorTab,
				};
			else throw new Error('Несуществующая вкладка');
		});
	}
	function setCurrentCommand(tabId: string, commandId: number) {
		setTabs(prev => ({
			...prev,
			[tabId]: { ...prev[tabId], commandInExecution: commandId } as EditorTab,
		}));
	}
	function makeErrorResult(id: string | undefined, msg: string) {
		if (id == undefined) {
			console.debug('called makeError with unknown id and msg', msg);
			throw new Error('Не определен идентификатор команды');
		}
		const now = new Date().toLocaleTimeString();
		return { id: id, actionType: 'error', timestamp: now, res: msg } as Result;
	}
	async function executeEntry(tabId: string, entry: Command, index: number) {
		console.debug('started executing entry ', entry);
		const prepres = await preprocess(entry, index);
		if (prepres) updateTabResults(tabId, prepres);
		try {
			const iteratorForInclude = async (cont: Command, ind: number) => {
				await executeEntry(tabId, cont, ind);
			};
			const res = await execute(entry, index, iteratorForInclude);
			updateTabResults(tabId, res);
		} catch (err: any) {
			if (err instanceof Error)
				updateTabResults(tabId, makeErrorResult(entry.id, err.message));
			else
				updateTabResults(
					tabId,
					makeErrorResult(entry.id, 'неизвестная ошибка')
				);
			addErrorId(setTabs, tabId, index);
		}
	}

	async function executeTabScript(
		id: string | undefined,
		tabContent: Array<Command>
	) {
		if (id == undefined) throw new Error('Не определен идентификатор вкладки');
		console.info('start executing tab ', id, 'with contents ', tabContent);
		clearTabResults(id);
		clearTabErrorIds(id);
		setTabs(prev => ({
			...prev,
			[id]: { ...prev[id], isBeingExecuted: true } as EditorTab,
		}));
		for (let i = 0; i < tabContent.length; i++) {
			const item = tabContent[i];
			setCurrentCommand(id, i);
			if (item != undefined) await executeEntry(id, item, i);
		}
		setCurrentCommand(id, tabContent.length);
		setTabs(prev => ({
			...prev,
			[id]: { ...prev[id], isBeingExecuted: false } as EditorTab,
		}));
	}
	function entryHasEmptyFields(entry: EditorTab) {
		entry.content.reduce((acc, command) => {
			return acc || hasEmptyFields(command);
		}, false);
	}

	return { setCurrentTabErrorIDs, executeTabScript, entryHasEmptyFields };
}
