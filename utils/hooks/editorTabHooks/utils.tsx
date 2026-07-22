import { Result } from '../command/commandExecutionToolkit';
import { Command } from '../command/command';
export interface EditorTab {
	id: string;
	name: string;
	path: null | string;
	content: Array<Command>;
	result: Array<Result>;
	errorIDs: Array<number>;
	commandInExecution: number;
	isBeingExecuted: boolean;
}
export function addErrorId(
	setTabs: React.Dispatch<React.SetStateAction<Record<string, EditorTab>>>,
	tabId: string,
	errorId: number
) {
	setTabs(prev => {
		const tab = prev[tabId];
		if (tab == undefined) throw new Error('Несуществующая вкладка');
		return {
			...prev,
			[tabId]: {
				...prev[tabId],
				errorIDs: [...tab.errorIDs, errorId],
			} as EditorTab,
		};
	});
}
