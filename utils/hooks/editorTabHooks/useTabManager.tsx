import { useCallback, useState } from 'react';
import { usePersistentData } from '@/utils/hooks/usePersistentData';
import { Command } from '../command/command';
import { CommandConstructionToolkit } from '../command/commandConstructionToolkit';
import { EditorTab, addErrorId, fpath } from './utils';
import {
	getTest,
	postTest,
	renameFile,
	deleteFile,
} from '@/utils/api_wrap/fileAPI';
export function useTabManager(scheme: string) {
	const [currentTabId, setCurrentTabId] = useState<string | null>(null);
	const [tabs, setTabs] = useState<Record<string, EditorTab>>({});
	const { saveData, loadData, clearData } = usePersistentData({
		storageKey: 'editor-contents',
		storageType: 'session',
	});

	const addTab = useCallback(
		async (filename: string | null = null) => {
			const name = filename || 'untitled' + Date.now();
			console.debug('name in addTab', name);
			console.debug('tab vals in addTab', tabs);
			const existingTabs = Object.values(tabs).filter(item => {
				console.debug('names', item.name, name);
				return item.name == name;
			});
			console.debug('found existing tabs in addTab', existingTabs);
			if (existingTabs[0] != undefined) {
				console.debug('returning existing tab in addTab', existingTabs[0]);
				setCurrentTabId(existingTabs[0].id);
				return existingTabs[0].id;
			}

			const tab: EditorTab = {
				id: crypto.randomUUID(),
				name: name,
				content: [],
				errorIDs: [],
				commandInExecution: -1,
				isBeingExecuted: false,
			};
			if (filename) {
				console.debug('fetching content in addTab');
				try {
					const content = getTest(scheme, filename);

					tab.content = Array.isArray(content)
						? content.map(item =>
								CommandConstructionToolkit.makeNew(scheme, item)
							)
						: ([] as Array<Command>);
				} catch (err) {}
			}
			console.debug('made tab in addTab', tab);
			setTabs(prev => {
				return { ...prev, [tab.id]: tab };
			});
			setCurrentTabId(tab.id);

			return tab.id;
		},
		[tabs, setCurrentTabId, setTabs]
	);
	const deleteTab = useCallback(
		(id: string | undefined) => {
			if (id == undefined) throw new Error('Несуществующая вкладка');
			let ids = Object.keys(tabs);
			if (currentTabId == id)
				if (ids.length > 1) {
					const index = ids.indexOf(id);
					const newIndex = index > 0 ? index - 1 : index + 1;
					const newId = ids[newIndex];
					if (newId == undefined)
						throw new Error('оно умудрилось вытащить undef из массива вкладок');
					setCurrentTabId(newId);
				} else setCurrentTabId(null);
			setTabs(prev => {
				const { [id]: _, ...res } = prev;
				return res;
			});
		},
		[currentTabId, tabs, setTabs]
	);
	const renameTab = useCallback(
		(id: string | undefined, name: string) => {
			console.debug('entered rename tab');
			if (id == undefined) throw new Error('Несуществующая вкладка');
			setTabs(prev => {
				console.debug('ol tabs', prev);
				console.debug('new tabs', {
					...prev,
					[id]: { ...prev[id], name: name } as EditorTab,
				});
				return { ...prev, [id]: { ...prev[id], name: name } as EditorTab };
			});
		},
		[setTabs]
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
		clearData();
	}, [clearData]);

	const initTabs = useCallback(
		async (files: Array<string> | string | null) => {
			console.debug('entered init tabs');
			const fileErrors = [] as Array<string>;
			const data = loadData();
			if (data) {
				const { tabs_, current } = data;
				if (!files && Object.keys(tabs_).length == 0) {
					const newId = await addTab();
					setCurrentTabId(newId);
				} else {
					if (Object.keys(tabs_).length > 0) {
						setTabs(tabs_);
						setCurrentTabId(current);
					}
					if (files) {
						if (Array.isArray(files)) {
							console.debug('fpath is array');
							await Promise.all(
								files.map(async file => {
									try {
										const existingTabs = Object.values(tabs_).filter(item => {
											return typeof item == 'object' && item != undefined
												? 'name' in item
													? item.name == file
													: false
												: false;
										});
										if (existingTabs[0] != undefined) return;
										await addTab(file);
									} catch (err) {
										fileErrors.push(
											`${err instanceof Error ? err.message : 'ошибка'} при открытии ${file}`
										);
									}
								})
							);
						} else
							try {
								const existingTabs = Object.values(tabs_).filter(item => {
									return typeof item == 'object' && item != undefined
										? 'name' in item
											? item.name == files
											: false
										: false;
								});
								if (existingTabs[0] != undefined) return;
								await addTab(files);
							} catch (err) {
								fileErrors.push(
									`${err instanceof Error ? err.message : 'ошибка'} при открытии ${files}`
								);
							}
					}
				}
				//clearSessionStorage();
				return fileErrors;
			}
			if (files) {
				if (Array.isArray(files)) {
					await Promise.all(files.map(path => addTab(path)));
				} else await addTab(files);
			} else {
				const newId = await addTab();
				setCurrentTabId(newId);
			}
			return fileErrors;
		},
		[addTab, setCurrentTabId, setTabs]
	);

	const resetTabContent = useCallback(
		(
			content: Command[] | Array<Record<string, string | number>>,
			tabId: string | null = currentTabId
		) => {
			if (!tabId) return;
			const newContent = content.map((entry, id) => {
				try {
					return CommandConstructionToolkit.makeNew(scheme, entry);
				} catch (err: any) {
					addErrorId(setTabs, tabId, id);
					return CommandConstructionToolkit.makeNew(scheme);
				}
			});
			setTabs(prev => {
				return {
					...prev,
					[tabId]: { ...prev[tabId], content: newContent } as EditorTab,
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
			setTabs(prev => {
				const tab = prev[tabId];
				if (tab == undefined) throw new Error('Несуществующая вкладка');
				return {
					...prev,
					[tabId]: {
						...prev[tabId],
						content:
							updater instanceof Function ? updater(tab.content) : updater,
					} as EditorTab,
				};
			});
		},
		[tabs, currentTabId]
	);
	const setCurrentCommand = useCallback(
		(tabId: string, commandId: string | number) => {
			if (!tabId) return;
			setTabs(prev => {
				const tab = prev[tabId];
				if (tab == undefined) throw new Error('Несуществующая вкладка');
				return {
					...prev,
					[tabId]: {
						...prev[tabId],
						commandInExecution: commandId,
					} as EditorTab,
				};
			});
		},
		[tabs]
	);
	const toggleBeingExec = useCallback(
		(tabId: string, isExec: boolean) => {
			if (!tabId) return;
			setTabs(prev => {
				const tab = prev[tabId];
				if (tab == undefined) throw new Error('Несуществующая вкладка');
				return {
					...prev,
					[tabId]: {
						...prev[tabId],
						isBeingExecuted: isExec,
					} as EditorTab,
				};
			});
		},
		[tabs]
	);
	function setTabErrorIDs(
		tabId: string,
		updater: (prev: Array<number>) => Array<number>
	) {
		if (!tabId) return;
		setTabs(prev => {
			if (prev[tabId] != undefined)
				return {
					...prev,
					[tabId]: {
						...prev[tabId],
						errorIDs: updater(prev[tabId].errorIDs),
					} as EditorTab,
				};
			else throw new Error('Несуществующая вкладка');
		});
	}
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
		setCurrentCommand,
		toggleBeingExec,
		setTabErrorIDs,
	};
}
