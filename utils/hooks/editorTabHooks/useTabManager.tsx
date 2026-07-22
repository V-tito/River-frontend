import { useCallback, useState } from 'react';
import { usePersistentData } from '@/utils/hooks/usePersistentData';
import { Command } from '../command/command';
import { CommandConstructionToolkit } from '../command/commandConstructionToolkit';
import { EditorTab, addErrorId } from './utils';

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
				isBeingExecuted: false,
			};
			setTabs(prev => {
				return { ...prev, [tab.id]: tab };
			});
			setCurrentTabId(tab.id);

			return tab.id;
		},
		[tabs, setCurrentTabId, setTabs]
	);
	const deleteTab = useCallback(
		(id: string) => {
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
		(id: string, name: string) => {
			setTabs(prev => {
				return { ...prev, [id]: { ...prev[id], name: name } as EditorTab };
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
		clearData();
	}, [clearData]);

	const initTabs = (filepath: string | null) => {
		const data = loadData();
		if (data) {
			const { tabs_, current } = data;
			if (!filepath && Object.keys(tabs_).length == 0) {
				const newId = addTab();
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
			setCurrentTabId(newId);
		}
	};

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
