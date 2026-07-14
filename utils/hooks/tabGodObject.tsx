import { useCallback, useState } from 'react';
import { usePersistentData } from '@/utils/hooks/usePersistentData';
import { CommandAction, Command } from './command/command';
import { CommandConstructionToolkit } from './command/commandConstructionToolkit';
import {
	CommandExecutionToolkit,
	Result,
} from './command/commandExecutionToolkit';

interface EditorTab {
	id: string;
	name: string;
	path: null | string;
	content: Array<Command>;
	result: Array<Result>;
	errorIDs: Array<number>;
	commandInExecution: number;
}
function addErrorId(
	setTabs: React.Dispatch<React.SetStateAction<Record<string, EditorTab>>>,
	tabId: string,
	errorId: number
) {
	setTabs(prev => ({
		...prev,
		[tabId]: { ...prev[tabId], errorIDs: [...prev[tabId].errorIDs, errorId] },
	}));
}
export function useTabManager(scheme: string) {
	const [currentTabId, setCurrentTabId] = useState<string | null>(null);
	const [tabs, setTabs] = useState<Record<string, EditorTab>>({});
	const { saveData, loadData, clearData } = usePersistentData({
		storageKey: 'editor-contents',
		storageType: 'session',
	});

	const addTab = useCallback(
		(path: null | string = null) => {
			const name = path
				? path.split('/').pop() || 'untitled' + Date.now()
				: 'untitled' + Date.now();
			console.log('adding tab with name', name, 'to tabs', tabs);
			const existingTab = Object.values(tabs).filter(
				item => item.name == name
			)[0];
			if (existingTab) {
				setCurrentTabId(existingTab.id);
				return existingTab.id;
			}
			const tab: EditorTab = {
				id: crypto.randomUUID(),
				name: name,
				path: path,
				content: [],
				result: [],
				errorIDs: [],
				commandInExecution: -1,
			};
			console.log('new tab', tab);
			setTabs(prev => {
				console.log('tabs in setting ', { ...prev, [tab.id]: tab });
				return { ...prev, [tab.id]: tab };
			});
			console.log('tabs within hook', tabs);
			setCurrentTabId(tab.id);

			return tab.id;
		},
		[tabs, setCurrentTabId, setTabs]
	);
	const deleteTab = useCallback(
		(id: string) => {
			console.log('deleting tab by id', id, 'from tabs', tabs);
			const name = tabs[id].name;
			let ids = Object.keys(tabs);
			if (currentTabId == id)
				if (ids.length > 1) {
					const index = ids.indexOf(id);
					setCurrentTabId(ids[index > 0 ? index - 1 : index + 1]);
				} else setCurrentTabId(null);
			setTabs(prev => {
				const { [id]: _, ...res } = prev;
				console.log('new tabs to be', res);
				return res;
			});
		},
		[currentTabId, tabs, setTabs]
	);
	const renameTab = useCallback(
		(id: string, name: string) => {
			setTabs(prev => {
				return { ...prev, [id]: { ...prev[id], name: name } };
			});
		},
		[setTabs, tabs]
	);

	const saveTabsToSessionStorage = useCallback(() => {
		saveData({
			tabs_: tabs,
			current: currentTabId,
		});
	}, [tabs, currentTabId]);

	const loadTabsFromSessionStorage = useCallback(() => {
		const data = loadData();
		if (data) {
			const { tabs_, current } = data;
			setTabs(tabs_);
			setCurrentTabId(current);
		}
	}, []);
	const clearSessionStorage = useCallback(() => {
		console.debug('triggered clearSessionStorage');
		clearData();
	}, [clearData]);

	const initTabs = (filepath: string | null) => {
		const data = loadData();
		console.debug('loaded data', data);
		if (data) {
			const { tabs_, current } = data;
			console.debug('tabs_.length', Object.keys(tabs_).length);
			console.debug('filepath', filepath, '!filepath', !filepath);
			if (!filepath && Object.keys(tabs_).length == 0) {
				console.log('no tabs');
				const newId = addTab();
				console.log('tabs', tabs);
				console.log('new id', newId);
				setCurrentTabId(newId);
			} else {
				if (filepath) {
					if (Array.isArray(filepath)) {
						filepath.map(path => addTab(path));
					} else addTab(filepath);
				}
				if (Object.keys(tabs_).length > 0) {
					setTabs(tabs_);
					setCurrentTabId(current);
				}
			}
			//clearSessionStorage();
			return;
		}
		if (filepath) {
			if (Array.isArray(filepath)) {
				filepath.map(path => addTab(path));
			} else addTab(filepath);
		} else {
			const newId = addTab();
			console.log('tabs', tabs);
			console.log('new id', newId);
			setCurrentTabId(newId);
		}
	};

	const resetTabContent = useCallback(
		(
			content: Command[] | Array<Record<string, string | number>>,
			tabId: string | null = currentTabId
		) => {
			if (!tabId) return;
			console.debug('passed content is', content);
			const newContent = content.map((entry, id) => {
				try {
					return CommandConstructionToolkit.makeNew(scheme, entry);
				} catch (err: any) {
					addErrorId(setTabs, tabId, id);
					return CommandConstructionToolkit.makeNew(scheme);
				}
			});
			console.debug(
				'generated new content for tab with id',
				currentTabId,
				'is',
				newContent
			);
			setTabs(prev => {
				return {
					...prev,
					[tabId]: { ...prev[tabId], content: newContent },
				};
			});
		},
		[currentTabId, tabs, setTabs]
	);
	const updateTabContent = useCallback(
		(
			updater: Array<Command> | ((prev: Array<Command>) => Array<Command>),
			tabId: string | null = currentTabId
		) => {
			if (!tabId) return;
			console.log('updater passed to updateCurrentTabContent', updater);
			setTabs(prev => {
				return {
					...prev,
					[tabId]: {
						...prev[tabId],
						content:
							updater instanceof Function
								? updater(prev[tabId].content)
								: updater,
					},
				};
			});
		},
		[tabs, currentTabId]
	);
	return {
		currentTabId,
		setCurrentTabId,
		tabs,
		setTabs,
		addTab,
		deleteTab,
		renameTab,
		saveTabsToSessionStorage,
		loadTabsFromSessionStorage,
		clearSessionStorage,
		initTabs,
		resetTabContent,
		updateTabContent,
	};
}

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

export function useExecutionHook(
	setTabs: React.Dispatch<React.SetStateAction<Record<string, EditorTab>>>,
	currentTabId: string
) {
	const { preprocess, postprocess, execute } = CommandExecutionToolkit;
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
		console.debug('entry in execute entry', entry);
		console.debug('execute(entry)', execute(entry, index));
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
		console.debug('started execution');
		clearTabResults(id);
		clearTabErrorIds(id);
		for (let i = 0; i < tabContent.length; i++) {
			setCurrentCommand(id, i);
			await executeEntry(id, tabContent[i], i);
		}
		setCurrentCommand(id, tabContent.length);
	}

	return { setCurrentTabErrorIDs, executeTabScript };
}
