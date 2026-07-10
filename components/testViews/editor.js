//lib tools
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useBeforeUnload } from 'react-use';

//styles
import styles from './editor.module.css';
import tabStyles from '@/styles/tabHeaderStyles.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
//components
import TabHeader from './tabHeader';
import FileManager from './fileManagerForEditor';
import EditorTabs from './editorTabs';
import ResultTabs from './resultTabs';
import AddTabButton from './addTabButton';
//hooks
import { toggleScheme } from '@/utils/api_wrap/protocol';
import { useTabManager, useExecutionHook } from '@/utils/hooks/tabGodObject';

export const execAndMouseDisplayContext = createContext();
const Editor = ({ scheme }) => {
	const [isHovered, setIsHovered] = useState();
	const {
		currentTabId,
		setCurrentTabId,
		tabs,
		setTabs,
		addTab,
		deleteTab,
		renameTab,
		saveTabsToSessionStorage,
		initTabs,
		resetTabContent,
		updateTabContent,
	} = useTabManager(scheme.name);
	console.log('updateTabContent in editor is', updateTabContent);
	const { setCurrentTabErrorIDs, executeTabScript } = useExecutionHook(setTabs);
	const [loading, setLoading] = useState(true);
	const params = useSearchParams();
	const filepath = params.get('filepath');
	//load data on enter
	useEffect(() => {
		initTabs(filepath);
		setLoading(false);
	}, []);
	//save data on exit
	const router = useRouter();
	// Auto-save on change (with debounce)
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			saveTabsToSessionStorage();
		}, 500); // Debounce 500ms

		return () => clearTimeout(timeoutId);
	}, [saveTabsToSessionStorage]);
	// Save before page unload
	useBeforeUnload(() => {
		saveTabsToSessionStorage();
	}, true);
	useEffect(() => {
		const handleRouteChange = () => {
			saveTabsToSessionStorage();
		};
		// Using Next.js router events
		router.events?.on('routeChangeStart', handleRouteChange);
		return () => {
			router.events?.off('routeChangeStart', handleRouteChange);
		};
	}, [router, saveTabsToSessionStorage]);
	if (loading) return <p>Загрузка...</p>;

	return (
		<div className="flex flex-col">
			<div className={tabStyles.tabHeaders}>
				<button
					className={tabStyles.execButton}
					onClick={async e => {
						await toggleScheme(scheme.name);
						console.debug('toggled on scheme');
						const all = Object.keys(tabs).map(tabID =>
							executeTabScript(tabID, tabs[tabID].content)
						);
						await Promise.all(all);
						await toggleScheme(scheme.name, false);
					}}
				>
					Выполнить все
				</button>
				{Object.keys(tabs).map(
					(
						tabID //TODO make sortable
					) => (
						<TabHeader
							key={tabID}
							id={tabID}
							name={tabs[tabID].name}
							overallCount={Object.keys(tabs).length}
							current={currentTabId}
							setCurrent={setCurrentTabId}
							deleteTab={deleteTab}
						></TabHeader>
					)
				)}

				<AddTabButton addTab={addTab}></AddTabButton>
			</div>
			<execAndMouseDisplayContext.Provider
				value={{
					isHovered,
					setIsHovered,
					current: currentTabId ? tabs[currentTabId].commandInExecution : -1,
				}}
			>
				<div className={styles.main}>
					<EditorTabs
						tabs={tabs}
						setTabs={setTabs}
						currentTabId={currentTabId}
						updateTabContent={updateTabContent}
						setCurrentTabErrorIDs={setCurrentTabErrorIDs}
						executeTabScript={executeTabScript}
						scheme={scheme.name}
						toggleScheme={toggleScheme}
					></EditorTabs>

					<ResultTabs
						results={currentTabId ? tabs[currentTabId].result : []}
					></ResultTabs>
				</div>
			</execAndMouseDisplayContext.Provider>
			<FileManager
				currentTab={
					currentTabId ? tabs[currentTabId] : { content: [], name: '' }
				}
				addTab={addTab}
				renameTab={renameTab}
				resetTabContent={resetTabContent}
				scheme={scheme.name}
			></FileManager>
		</div>
	);
};
export default Editor;
