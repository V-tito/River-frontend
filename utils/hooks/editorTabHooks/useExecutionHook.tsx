import { CommandExecutionToolkit } from '../command/commandExecutionToolkit';
import { Command, commandTypeCheckers } from '../command/command';
import { useRef } from 'react';
import { CommandBarHelpers } from '../command/commandBarHelpers';
const commandActionToLogType = (command: Command) => {
	return CommandBarHelpers.isSetter(command)
		? 'setter'
		: commandTypeCheckers.isInclude(command) ||
			  commandTypeCheckers.isLoop(command)
			? 'wrapper'
			: 'checker';
};
export function useExecutionHook(
	setCurrentCommand: (tabId: string, commandId: string | number) => void,
	toggleExecState: (tabId: string, isBeingExecuted: boolean) => void,
	addErrID: (tabId: string, errId: string | number) => void,
	appendResultToLog: (
		msg: string,
		actionType: string,
		id: string,
		testName: string
	) => void
) {
	const { preprocess, execute } = CommandExecutionToolkit;
	const abortControllers = useRef<Record<string, AbortController>>({});
	function addAbortController(id: string) {
		const res = new AbortController();
		abortControllers.current = {
			...abortControllers.current,
			[id]: res,
		};
		return res;
	}

	async function executeEntry(
		tabId: string,
		tabName: string,
		entry: Command,
		index: number,
		abort: AbortController
	) {
		console.debug('started executing entry ', entry);
		const logtyp = commandActionToLogType(entry);
		const updateLog = (typ: string, msg: string) =>
			appendResultToLog(msg, typ, entry.id, tabName);
		const prepres = await preprocess(entry);
		if (prepres) {
			updateLog(logtyp, prepres);
		}
		try {
			const iteratorLambda = async (cont: Command, ind: number) => {
				await executeEntry(tabId, tabName, cont, ind, abort);
			};
			const { res, checkError } = await execute(
				entry,
				index,
				iteratorLambda,
				abort
			);
			updateLog(checkError ? 'checkError' : logtyp, res);
			return { checkError };
		} catch (err: any) {
			console.debug('caught err while executing entry', err);
			const errmsg = err.message ?? 'неизвестная ошибка';
			addErrID(tabId, index);
			updateLog('error', errmsg);
			return { error: true };
		}
	}

	async function executeTabScript(
		id: string | undefined,
		name: string,
		tabContent: Array<Command>
		//abort: RefObject<Record<string, AbortController> | null> | null
	) {
		if (id == undefined) throw new Error('Не определен идентификатор вкладки');
		const abort = addAbortController(id);
		console.info('start executing tab ', id, 'with contents ', tabContent);
		await new Promise(res => setTimeout(res, 500));
		console.log('waited 1.5 seconds');
		toggleExecState(id, true);

		let fatal = false;
		let aborted = false;
		let executed = 0,
			checks = 0,
			checkErrors = 0,
			netErrors = 0;
		console.debug('abort current in exhook', abort);
		for (executed; executed < tabContent.length; executed++) {
			if (abort?.signal.aborted) {
				console.debug('aborting exec');
				aborted = true;
				break;
			}
			const item = tabContent[executed];
			setCurrentCommand(id, executed);
			if (item != undefined) {
				const { checkError, error } = await executeEntry(
					id,
					name,
					item,
					executed,
					abort
				);
				if (
					commandTypeCheckers.isCheck(item) ||
					commandTypeCheckers.isWaitForSignal(item)
				) {
					if (checkError) {
						checkErrors++;
						if (item.fatal) {
							fatal = true;
							break;
						}
					} else {
						checks++;
					}
				} else if (error) netErrors++;
				if (fatal) break;
			}
		}
		if (!fatal && !aborted) setCurrentCommand(id, tabContent.length);
		else if (!aborted) executed++;
		toggleExecState(id, false);
		const msg = `Выполнено команд: ${executed}.\n Успешных тестов: ${checks}.\n Ошибочных тестов: ${checkErrors}. \n Других инструкций: ${executed - checks - checkErrors}. \n ${netErrors > 0 ? `${netErrors} команд завершились с ошибкой из-за внутренних ошибок стенда или ошибок скрипта. \n` : ''} Выполнение ${aborted ? 'было прервано' : ` ${fatal ? 'завершилось из-за фатальной ошибки теста' : 'завершилось БЕЗ фатальных ошибок теста'}`}.`;
		const summaryTyp = checkErrors + netErrors > 0 ? 'error' : 'summary';
		appendResultToLog(msg, summaryTyp, id, name);
	}

	return {
		executeTabScript,
		abortControllers,
	};
}
