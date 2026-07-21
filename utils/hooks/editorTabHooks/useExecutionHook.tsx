import {
	CommandExecutionToolkit,
	Result,
} from '../command/commandExecutionToolkit';
import { EditorTab, addErrorId } from './utils';
import { Command } from '../command/command';

export function useExecutionHook(
	setTabs: React.Dispatch<React.SetStateAction<Record<string, EditorTab>>>,
	currentTabId: string
) {
	const { preprocess, postprocess, execute, hasEmptyFields } =
		CommandExecutionToolkit;
	function updateTabResults(id: string, result: Result) {
		setTabs(prev => {
			return {
				...prev,
				[id]: { ...prev[id], result: [...prev[id].result, result] },
			};
		});
	}
	function clearTabResults(id: string) {
		setTabs(prev => {
			return {
				...prev,
				[id]: { ...prev[id], result: [] },
			};
		});
	}
	function clearTabErrorIds(tabId: string) {
		setTabs(prev => ({
			...prev,
			[tabId]: { ...prev[tabId], errorIDs: [] },
		}));
	}

	function setCurrentTabErrorIDs(
		updater: (prev: Array<number>) => Array<number>
	) {
		setTabs(prev => {
			return {
				...prev,
				[currentTabId]: {
					...prev[currentTabId],
					errorIDs: updater(prev[currentTabId].errorIDs),
				},
			};
		});
	}
	function setCurrentCommand(tabId: string, commandId: number) {
		setTabs(prev => ({
			...prev,
			[tabId]: { ...prev[tabId], commandInExecution: commandId },
		}));
	}
	function makeErrorResult(id: number, msg: string) {
		const now = new Date().toLocaleTimeString();
		return { id: id, actionType: 'error', timestamp: now, res: msg } as Result;
	}
	async function executeEntry(tabId: string, entry: Command, index: number) {
		console.debug('started executing entry ', entry);
		const prepres = await preprocess(entry, index);
		if (prepres) updateTabResults(tabId, prepres);
		try {
			const res = await execute(entry, index);
			updateTabResults(tabId, res);
		} catch (err: any) {
			if (err instanceof Error)
				updateTabResults(tabId, makeErrorResult(index, err.message));
			else
				updateTabResults(tabId, makeErrorResult(index, 'неизвестная ошибка'));
			addErrorId(setTabs, tabId, index);
		}
		const iteratorForInclude = (cont: Command, ind: number) => {
			executeEntry(tabId, cont, ind);
		};
		//still stronger connection that i'd like; todo think on fixing
		try {
			const postres = await postprocess(entry, index, iteratorForInclude);
			if (postres) updateTabResults(tabId, postres);
		} catch (err: any) {
			if (err instanceof Error)
				updateTabResults(tabId, makeErrorResult(index, err.message));
			else
				updateTabResults(tabId, makeErrorResult(index, 'неизвестная ошибка'));
			addErrorId(setTabs, tabId, index);
		}
	}

	async function executeTabScript(id: string, tabContent: Array<Command>) {
		console.info('start processing tab ', id, 'with contents ', tabContent);
		clearTabResults(id);
		clearTabErrorIds(id);
		setTabs(prev => ({
			...prev,
			[id]: { ...prev[id], isBeingExecuted: true },
		}));
		for (let i = 0; i < tabContent.length; i++) {
			setCurrentCommand(id, i);
			await executeEntry(id, tabContent[i], i);
		}
		setCurrentCommand(id, tabContent.length);
		setTabs(prev => ({
			...prev,
			[id]: { ...prev[id], isBeingExecuted: false },
		}));
	}
	function entryHasEmptyFields(entry: EditorTab) {
		entry.content.reduce((acc, command) => {
			return acc || hasEmptyFields(command);
		}, false);
	}

	return { setCurrentTabErrorIDs, executeTabScript, entryHasEmptyFields };
}
