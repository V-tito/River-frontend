import {
	CommandExecutionToolkit,
	Result,
} from '../command/commandExecutionToolkit';
import { EditorTab, addErrorId } from './utils';
import { Command, commandTypeCheckers } from '../command/command';
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
			//updateTabResults(tabId, res);
			return res;
		} catch (err: any) {
			console.debug('caught err while executing entry', err);
			addErrorId(setTabs, tabId, index);
			if (err instanceof Error) return makeErrorResult(entry.id, err.message);
			//updateTabResults(tabId, makeErrorResult(entry.id, err.message));
			else return makeErrorResult(entry.id, 'неизвестная ошибка');
			//updateTabResults(
			//	tabId,
			//	makeErrorResult(entry.id, 'неизвестная ошибка')
			//);

			//return false;
		}
	}

	async function executeTabScript(
		id: string | undefined,
		tabContent: Array<Command>
	) {
		if (id == undefined) throw new Error('Не определен идентификатор вкладки');

		console.info('start executing tab ', id, 'with contents ', tabContent);
		await new Promise(res => setTimeout(res, 1500));
		console.log('waited 1.5 seconds');
		clearTabResults(id);
		clearTabErrorIds(id);
		setTabs(prev => ({
			...prev,
			[id]: { ...prev[id], isBeingExecuted: true } as EditorTab,
		}));

		let fatal = false;
		let executed = 0,
			checks = 0,
			checkErrors = 0,
			netErrors = 0;
		for (executed; executed < tabContent.length; executed++) {
			const item = tabContent[executed];
			setCurrentCommand(id, executed);
			if (item != undefined) {
				const res = await executeEntry(id, item, executed);
				updateTabResults(id, res);
				if (
					commandTypeCheckers.isCheck(item) ||
					commandTypeCheckers.isWaitForSignal(item)
				) {
					if (res.actionType == 'checkError') {
						checkErrors++;
						if (item.fatal) {
							fatal = true;
							break;
						}
					} else {
						checks++;
					}
				} else if (res.actionType == 'error') netErrors++;
				if (fatal) break;
			}
		}
		if (!fatal) setCurrentCommand(id, tabContent.length);
		else executed++;
		setTabs(prev => ({
			...prev,
			[id]: { ...prev[id], isBeingExecuted: false } as EditorTab,
		}));
		const now = new Date().toLocaleTimeString();
		const msg = `Выполнено команд: ${executed}.\n Успешных тестов: ${checks}.\n Ошибочных тестов: ${checkErrors}. \n Других инструкций: ${executed - checks - checkErrors}. \n ${netErrors > 0 ? `${netErrors} команд не были выполнены из-за внутренних ошибок стенда. \n` : ''} Выполнение завешилось ${fatal ? 'из-за ошибки теста' : 'штатно'}.`;
		const summary = {
			id: id,
			actionType: checkErrors + netErrors > 0 ? 'error' : 'summary',
			timestamp: now,
			res: msg,
		};
		updateTabResults(id, summary as Result);
	}
	function entryHasEmptyFields(entry: EditorTab) {
		entry.content.reduce((acc, command) => {
			return acc || hasEmptyFields(command);
		}, false);
	}

	return { setCurrentTabErrorIDs, executeTabScript, entryHasEmptyFields };
}
