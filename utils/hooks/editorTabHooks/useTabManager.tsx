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
				isBeingExecuted: false,
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
