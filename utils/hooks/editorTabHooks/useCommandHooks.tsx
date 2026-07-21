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
		console.debug(
			'request to update field',
			field,
			' at index',
			commandIndex,
			'to value',
			value,
			'type of val',
			typeof value
		);
		setTabs(prev => {
			return {
				...prev,
				[currentTabId]: {
					...prev[currentTabId],
					content: prev[currentTabId].content.map((item, i) => {
						console.debug(
							'in setting tabs item',
							item,
							'i',
							i,
							'commandIndex',
							commandIndex,
							'i == commandIndex',
							i == commandIndex
						);
						return i == commandIndex
							? updateField(item, field as keyof Command, value)
							: item;
					}),
				},
			};
		});
		console.debug(
			'request to update field',
			field,
			' at index',
			commandIndex,
			'to value',
			value,
			'type of val',
			typeof value,
			' sat'
		);
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
