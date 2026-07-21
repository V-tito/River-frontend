import { CommandAction, Command } from '../command/command';
import { CommandConstructionToolkit } from '../command/commandConstructionToolkit';
import { EditorTab } from './utils';

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
			if (tab.content[commandIndex].action == actionType) return prev;
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
			return {
				...prev,
				[currentTabId]: {
					...prev[currentTabId],
					content: prev[currentTabId].content.map((item, i) => {
						return i == commandIndex
							? updateField(item, field as keyof Command, value)
							: item;
					}),
				},
			};
		});
	}

	function autoUpdateCommandSignalSubtype(
		commandIndex: number,
		sigtable: Record<string, Record<string, Array<Record<string, any>>>>
	) {
		setTabs(prev => {
			return {
				...prev,
				[currentTabId]: {
					...prev[currentTabId],
					content: prev[currentTabId].content.map((item, i) =>
						i == commandIndex ? autoUpdateSignalSubtype(item, sigtable) : item
					),
				},
			};
		});
	}
	function autoCleanCommand(
		commandIndex: number,
		sigtable: Record<string, Record<string, Array<Record<string, any>>>>
	) {
		setTabs(prev => {
			return {
				...prev,
				[currentTabId]: {
					...prev[currentTabId],
					content: prev[currentTabId].content.map((item, i) =>
						i == commandIndex ? autoClean(item, sigtable) : item
					),
				},
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
