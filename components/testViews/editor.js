//lib tools
import React, {
	useState,
	useEffect,
	createContext,
	useCallback,
	useRef,
} from 'react';
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
import { useGlobal } from '@/app/GlobalState';
import { toggleScheme } from '@/utils/api_wrap/protocol';
import { useTabManager } from '@/utils/hooks/editorTabHooks/useTabManager';
import { useExecutionHook } from '@/utils/hooks/editorTabHooks/useExecutionHook';

export const execAndMouseDisplayContext = createContext();
const Editor = ({ scheme }) => {
	const [isHovered, setIsHovered] = useState();
	const [execBlock, setExecBlock] = useState(false);
	const { pollingError, setPollingError } = useGlobal();
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
	console.info('mounted Editor component');
	const { setCurrentTabErrorIDs, executeTabScript, entryHasEmptyFields } =
		useExecutionHook(setTabs, currentTabId);
	const [loading, setLoading] = useState(true);
	const params = useSearchParams();
	const folder = params.get('folder');
	const filename = params.get('filename');
	const filepath =
		folder && filename
			? {
					folder: folder,
					filename: filename,
				}
			: null;
	//load data on enter
	const hasInitialized = useRef(false);
	useEffect(() => {
		const init = async () => {
			if (!hasInitialized.current) {
				try {
					const promise = initTabs(filepath);
					setLoading(false);
					hasInitialized.current = true;
					const errors = await promise;
					if (errors.length > 0)
						setPollingError({
							message: errors.reduce((acc, item) => {
								return acc + '\n' + item;
							}, ''),
						});
				} catch (err) {
					setPollingError(err);
				}
			}
		};
		init();
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
					disabled={execBlock}
					onClick={async e => {
						setExecBlock(true);
						console.debug('on hitting the ExecAll button, toggling on scheme');
						await toggleScheme(scheme.name);
						console.debug('on hitting the ExecAll button, toggled on scheme');
						const all = Object.keys(tabs).map(
							async tabID => await executeTabScript(tabID, tabs[tabID].content)
						);
						await Promise.all(all);
						console.debug('on hitting the ExecAll button, toggling off scheme');
						await toggleScheme(scheme.name, false);
						console.debug('on hitting the ExecAll button, toggled off scheme');
						setExecBlock(false);
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
						schemeName={scheme.name}
						hasEmpty={entryHasEmptyFields}
						execBlock={execBlock}
						setExecBlock={setExecBlock}
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
