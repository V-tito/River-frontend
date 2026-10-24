//lib tools
import React, { useState, useEffect, createContext, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
//styles
import styles from './editor.module.css';
//components
import CPview from '@/components/controlPanel/testingMode/CPview';
import FileManager from './fileManagerForEditor';
import EditorTabs from './editorTabs';
import LogView from './logView';
import TabHeaders from './tabHeaders';
import ExecCurrentButtons from './execCurrentButtons';
//hooks
import { useGlobal } from '@/app/GlobalState';
import { useTabManager } from '@/utils/hooks/editorTabHooks/useTabManager';
import { useExecutionHook } from '@/utils/hooks/editorTabHooks/useExecutionHook';
import { addErrorId } from '@/utils/hooks/editorTabHooks/utils';
import { useTesterLog } from '@/utils/hooks/useTesterLog';

export const execAndMouseDisplayContext = createContext();
const Editor = ({ scheme }) => {
	const [isHovered, setIsHovered] = useState();
	const [execBlock, setExecBlock] = useState(false);
	const { setPollingError, schemeOn } = useGlobal();
	useEffect(() => {
		setExecBlock(!schemeOn);
	}, [schemeOn]);
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
		setCurrentCommand,
		toggleBeingExec,
		setTabErrorIDs,
	} = useTabManager(scheme.name);
	console.info('mounted Editor component');
	const errads = (tabId, errorId) => addErrorId(setTabs, tabId, errorId);
	const { log, appendResultToLog, stringifyResult } = useTesterLog();
	const { executeTabScript, abortControllers } = useExecutionHook(
		setCurrentCommand,
		toggleBeingExec,
		errads,
		appendResultToLog
	);
	const setCurrentTabErrorIDs = updater =>
		setTabErrorIDs(currentTabId, updater);

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
	// Auto-save on change (with debounce)
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			saveTabsToSessionStorage();
		}, 500); // Debounce 500ms

		return () => clearTimeout(timeoutId);
	}, [saveTabsToSessionStorage]);
	useEffect(() => {
		return () => {
			Object.keys(abortControllers.current).map(id => {
				abortControllers.current[id].abort();
			});
		};
	}, [abortControllers]);
	console.debug(
		'abort controllers in editor',
		abortControllers,
		abortControllers.current
	);
	if (loading) return <p>Загрузка...</p>;
	return (
		<div className={styles.actualMain}>
			<execAndMouseDisplayContext.Provider
				value={{
					isHovered,
					setIsHovered,
					current: currentTabId ? tabs[currentTabId].commandInExecution : -1,
				}}
			>
				<div className={styles.main}>
					<CPview
						schemeName={scheme.name}
						className={styles.show}
						writeLog={appendResultToLog}
					></CPview>
					<div className={styles.tabs}>
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
									currentTabId={currentTabId}
									tabs={tabs}
									addTab={addTab}
									renameTab={renameTab}
									resetTabContent={resetTabContent}
									scheme={scheme.name}
								></FileManager>
							</div>
						</div>
					</div>
				</div>
				<LogView
					className={styles.results}
					results={log ?? []}
					formatter={stringifyResult}
				></LogView>
			</execAndMouseDisplayContext.Provider>
		</div>
	);
};
export default Editor;
