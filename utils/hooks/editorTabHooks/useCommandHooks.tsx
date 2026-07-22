import { CommandAction, Command } from '../command/command';
import { CommandConstructionToolkit } from '../command/commandConstructionToolkit';
import { EditorTab } from './utils';
import { sigtableEntry } from '../entryTypes';
export function useCommandHooks(
	setTabs: React.Dispatch<React.SetStateAction<Record<string, EditorTab>>>,
	currentTabId: string,
	scheme: string
) {
	const {
		makeNew,
		autoClean,
		autoUpdateSignalSubtype,
		updateField,
		changeAction,
	} = CommandConstructionToolkit;
	function addCommandToCurrentTab(commandIndex: number) {
		setTabs(prev => {
			const tab = prev[currentTabId];
			if (tab == undefined) throw new Error('Несуществующая вкладка');
			return {
				...prev,
				[currentTabId]: {
					...tab,
					content: tab.content.toSpliced(commandIndex, 0, makeNew(scheme)),
				},
			};
		});
	}
	function deleteCommandFromCurrentTab(commandIndex: number) {
		setTabs(prev => {
			const tab = prev[currentTabId];
			if (tab == undefined) throw new Error('Несуществующая вкладка');
			return {
				...prev,
				[currentTabId]: {
					...tab,
					content: tab.content.toSpliced(commandIndex, 1),
				},
			};
		});
	}
	function changeCommandActionType(
		commandIndex: number,
		actionType: CommandAction
	) {
		setTabs(prev => {
			const tab = prev[currentTabId];
			if (tab == undefined) throw new Error('Несуществующая вкладка');
			const content = tab.content[commandIndex];
			if (content == undefined) throw new Error('Несуществующая команда');
			if (content.action == actionType) return prev;
			return {
				...prev,
				[currentTabId]: {
					...tab,
					content: tab.content.map((item, i) =>
						i == commandIndex ? changeAction(item, actionType) : item
					),
				},
			};
		});
	}
	function updateCommandField(
		commandIndex: number,
		field: string,
		value: string | number | boolean
	) {
		setTabs(prev => {
			const tab = prev[currentTabId];
			if (tab == undefined) throw new Error('Несуществующая вкладка');
			return {
				...prev,
				[currentTabId]: {
					...prev[currentTabId],
					content: tab.content.map((item, i) => {
						return i == commandIndex
							? updateField(item, field as keyof Command, value)
							: item;
					}),
				} as EditorTab,
			};
		});
	}

	function autoUpdateCommandSignalSubtype(
		commandIndex: number,
		sigtable: Record<string, sigtableEntry>
	) {
		setTabs(prev => {
			const tab = prev[currentTabId];
			if (tab == undefined) throw new Error('Несуществующая вкладка');
			return {
				...prev,
				[currentTabId]: {
					...prev[currentTabId],
					content: tab.content.map((item, i) =>
						i == commandIndex ? autoUpdateSignalSubtype(item, sigtable) : item
					),
				} as EditorTab,
			};
		});
	}
	function autoCleanCommand(
		commandIndex: number,
		sigtable: Record<string, Record<string, Array<Record<string, any>>>>
	) {
		setTabs(prev => {
			const tab = prev[currentTabId];
			if (tab == undefined) throw new Error('Несуществующая вкладка');
			return {
				...prev,
				[currentTabId]: {
					...prev[currentTabId],
					content: tab.content.map((item, i) =>
						i == commandIndex ? autoClean(item, sigtable) : item
					),
				} as EditorTab,
			};
		});
	}

	return {
		addCommandToCurrentTab,
		deleteCommandFromCurrentTab,
		changeCommandActionType,
		updateCommandField,
		autoUpdateCommandSignalSubtype,
		autoCleanCommand,
	};
}
