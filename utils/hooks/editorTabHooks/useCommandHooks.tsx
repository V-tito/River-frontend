import { CommandAction, Command } from '../command/command';
import { CommandConstructionToolkit } from '../command/commandConstructionToolkit';
import { EditorTab } from './utils';
import { sigtableEntry } from '../entryTypes';
type T = React.Dispatch<React.SetStateAction<Record<string, EditorTab>>>;
export function useCommandHooks(
	setScript: (
		updater: Array<Command> | ((prev: Array<Command>) => Array<Command>)
	) => void,
	scheme: string
) {
	console.debug('setScript in useCommandHooks', setScript);
	const {
		makeNew,
		autoClean,
		autoUpdateSignalSubtype,
		updateField,
		changeAction,
	} = CommandConstructionToolkit;
	function addCommandToScript(commandIndex: number) {
		console.debug('setScript in addCommand', setScript);
		const newCommand = makeNew(scheme);
		console.debug('newCommand in addCommand', newCommand);
		const updater = (prev: Array<Command>) => {
			//const tab = prev[currentTabId];
			//if (tab == undefined) throw new Error('Несуществующая вкладка');
			const res = prev.toSpliced(commandIndex, 0, newCommand);
			console.debug('new script in addCommand', res);
			return res;
		};
		setScript(updater);
	}
	function addCommandCopy(commandIndex: number) {
		setScript(prev =>
			prev.toSpliced(
				commandIndex,
				0,
				makeNew(scheme, prev[commandIndex] as Command)
			)
		);
	}
	function deleteCommandFromScript(commandIndex: number) {
		setScript(prev => prev.toSpliced(commandIndex, 1));
	}
	function changeCommandActionType(
		commandIndex: number,
		actionType: CommandAction
	) {
		setScript(prev => {
			const content = prev[commandIndex];
			if (content == undefined) throw new Error('Несуществующая команда');
			if (content.action == actionType) return prev;
			return prev.map((item, i) =>
				i == commandIndex ? changeAction(item, actionType) : item
			);
		});
	}
	function updateCommandField(
		commandIndex: number,
		field: string,
		value: string | number | boolean | Array<Command>
	) {
		setScript(prev =>
			prev.map((item, i) => {
				return i == commandIndex
					? updateField(item, field as keyof Command, value)
					: item;
			})
		);
	}

	function autoUpdateCommandSignalSubtype(
		commandIndex: number,
		sigtable: Record<string, sigtableEntry>
	) {
		setScript(prev =>
			prev.map((item, i) =>
				i == commandIndex ? autoUpdateSignalSubtype(item, sigtable) : item
			)
		);
	}
	function autoCleanCommand(
		commandIndex: number,
		sigtable: Record<string, Record<string, Array<Record<string, any>>>>
	) {
		setScript(prev =>
			prev.map((item, i) =>
				i == commandIndex ? autoClean(item, sigtable) : item
			)
		);
	}

	return {
		addCommandToScript,
		addCommandCopy,
		deleteCommandFromScript,
		changeCommandActionType,
		updateCommandField,
		autoUpdateCommandSignalSubtype,
		autoCleanCommand,
	};
}
