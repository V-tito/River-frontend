import { useCallback, useState } from 'react';
import { usePersistentData } from '@/utils/hooks/usePersistentData';
import { Command } from '../command/command';
import { CommandConstructionToolkit } from '../command/commandConstructionToolkit';
import { EditorTab, addErrorId, fpath } from './utils';

export function useTabManager(scheme: string) {
	const [currentTabId, setCurrentTabId] = useState<string | null>(null);
	const [tabs, setTabs] = useState<Record<string, EditorTab>>({});
	const { saveData, loadData, clearData } = usePersistentData({
		storageKey: 'editor-contents',
		storageType: 'session',
	});

	const addTab = useCallback(
		async (path: null | fpath = null) => {
			console.debug('filepath in addTab', path);
			const name = path
				? path.filename || 'untitled' + Date.now()
				: 'untitled' + Date.now();
			console.debug('name in addTab', name);
			console.debug('tab vals in addTab', tabs);
			const existingTabs = Object.values(tabs).filter(
				item => item.name == name
			);
			console.debug('found existing tabs in addTab', existingTabs);
			if (existingTabs[0] != undefined) {
				console.debug('returning existing tab in addTab', existingTabs[0]);
				setCurrentTabId(existingTabs[0].id);
				return existingTabs[0].id;
			}

			const tab: EditorTab = {
				id: crypto.randomUUID(),
				name: name,
				path: path,
				content: [],
				result: [],
				errorIDs: [],
				commandInExecution: -1,
				isBeingExecuted: false,
			};
			if (path) {
				console.debug('fetching content in addTab');
				const response = await fetch(
					`/api/files?folder=${path.folder}&filename=${path.filename}`,
					{
						method: 'GET',
					}
				);
				console.debug('response in addTab', response);
				const contentFile = await response.json();
				console.debug('contentFile in addTab', contentFile);
				if (contentFile.type != 'file') {
					throw new Error(`${path.folder}/${path.filename} не является файлом`);
				}
				tab.content = JSON.parse(contentFile.content);
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
		async (filepath: Array<fpath> | fpath | null) => {
			console.debug('entered init tabs');
			const fileErrors = [];
			const data = loadData();
			if (data) {
				const { tabs_, current } = data;
				if (!filepath && Object.keys(tabs_).length == 0) {
					const newId = await addTab();
					setCurrentTabId(newId);
				} else {
					if (Object.keys(tabs_).length > 0) {
						setTabs(tabs_);
						setCurrentTabId(current);
					}
					if (filepath) {
						if (Array.isArray(filepath)) {
							console.debug('fpath is array');
							await Promise.all(
								filepath.map(async path => {
									try {
										await addTab(path);
									} catch (err) {
										fileErrors.push(
											`${err instanceof Error ? err.message : 'ошибка'} при открытии ${path.folder}/${path.filename}`
										);
									}
								})
							);
						} else
							try {
								await addTab(filepath);
							} catch (err) {
								fileErrors.push(
									`${err instanceof Error ? err.message : 'ошибка'} при открытии ${filepath.folder}/${filepath.filename}`
								);
							}
					}
				}
				//clearSessionStorage();
				return fileErrors;
			}
			if (filepath) {
				if (Array.isArray(filepath)) {
					await Promise.all(filepath.map(path => addTab(path)));
				} else await addTab(filepath);
			} else {
				const newId = await addTab();
				setCurrentTabId(newId);
			}
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
