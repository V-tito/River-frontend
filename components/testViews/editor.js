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
//components
import CPview from '@/components/controlPanel/testingMode/CPview';
import FileManager from './fileManagerForEditor';
import EditorTabs from './editorTabs';
import ResultTabs from './resultTabs';
import TabHeaders from './tabHeaders';
import ExecCurrentButtons from './execCurrentButtons';
//hooks
import { useGlobal } from '@/app/GlobalState';
import { useTabManager } from '@/utils/hooks/editorTabHooks/useTabManager';
import { useExecutionHook } from '@/utils/hooks/editorTabHooks/useExecutionHook';

export const execAndMouseDisplayContext = createContext();
const Editor = ({ scheme }) => {
	const [isHovered, setIsHovered] = useState();
	const [execBlock, setExecBlock] = useState(false);
	const { setPollingError } = useGlobal();
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
	const {
		setCurrentTabErrorIDs,
		executeTabScript,
		entryHasEmptyFields,
		abortControllers,
	} = useExecutionHook(setTabs, currentTabId);
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
			<execAndMouseDisplayContext.Provider
				value={{
					isHovered,
					setIsHovered,
					current: currentTabId ? tabs[currentTabId].commandInExecution : -1,
				}}
			>
				<div className={styles.main}>
					<CPview schemeName={scheme.name} className={styles.show}></CPview>
					<div className="flex flex-col">
						<TabHeaders
							execBlock={execBlock}
							setExecBlock={setExecBlock}
							executeTabScript={executeTabScript}
							abortControllers={abortControllers}
							tabs={tabs}
							currentTabId={currentTabId}
							setCurrentTabId={setCurrentTabId}
							deleteTab={deleteTab}
							addTab={addTab}
						/>
						<div className={styles.show}>
							<EditorTabs
								tabs={tabs}
								setTabs={setTabs}
								currentTabId={currentTabId}
								updateTabContent={updateTabContent}
								setCurrentTabErrorIDs={setCurrentTabErrorIDs}
								schemeName={scheme.name}
							></EditorTabs>
							<div className={styles.buttonGroups}>
								<ExecCurrentButtons
									executeTabScript={executeTabScript}
									schemeName={scheme.name}
									tabs={tabs}
									currentTabId={currentTabId}
									setPollingError={setPollingError}
									execBlock={execBlock}
									setExecBlock={setExecBlock}
									abortControllers={abortControllers}
								/>
								<FileManager
									currentTab={
										currentTabId
											? tabs[currentTabId]
											: { content: [], name: '' }
									}
									addTab={addTab}
									renameTab={renameTab}
									resetTabContent={resetTabContent}
									scheme={scheme.name}
								></FileManager>
							</div>
						</div>
					</div>
				</div>
				<ResultTabs
					className={styles.results}
					results={currentTabId ? tabs[currentTabId].result : []}
				></ResultTabs>
			</execAndMouseDisplayContext.Provider>
		</div>
	);
};
export default Editor;
