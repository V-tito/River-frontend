import React, { createContext, useEffect } from 'react';
import styles from './editor.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import SortableBarEditor from './commandBars/sortableBarEditor';
import { useCommandHooks } from '@/utils/hooks/editorTabHooks/useCommandHooks';
import { useGlobal } from '@/app/GlobalState';
import { toggleScheme } from '@/utils/api_wrap/protocol';

export const errorIDsContext = createContext();
//export const commandHooksContext = createContext();
export const SchemeContext = createContext();
const EditorTabs = ({
	tabs,
	setTabs,
	currentTabId,
	updateTabContent,
	setCurrentTabErrorIDs,
	executeTabScript,
	schemeName,
	hasEmpty,
	execBlock,
	setExecBlock,
	abortControllers,
}) => {
	console.info('mounted EditorTabs component');
	const { setPollingError } = useGlobal();
	const setScript = updater =>
		setTabs(prev => {
			return {
				...prev,
				[currentTabId]: {
					...prev[currentTabId],
					content:
						typeof updater == 'function'
							? updater(prev[currentTabId].content)
							: updater,
				},
			};
		});
	return (
		<div className={styles.show}>
			<header className={headerStyles.modalHeader}>Редактор команд: </header>
			<errorIDsContext.Provider
				value={{
					errorIDs: currentTabId ? tabs[currentTabId].errorIDs : [],
					setErrorIDs: setCurrentTabErrorIDs,
				}}
			>
				<SchemeContext.Provider value={schemeName}>
					<SortableBarEditor
						formData={currentTabId ? tabs[currentTabId].content : []}
						setFormData={updateTabContent}
						setErrorIDs={setCurrentTabErrorIDs}
						setError={setPollingError}
						blockEditing={
							currentTabId ? tabs[currentTabId].isBeingExecuted : false
						}
						hooks={useCommandHooks(setScript, schemeName)}
					></SortableBarEditor>
				</SchemeContext.Provider>
			</errorIDsContext.Provider>
			<button
				onClick={async e => {
					try {
						setExecBlock(true);
						console.debug('on hitting the exec button, toggling on scheme');
						const toggleres = await toggleScheme(schemeName);
						console.debug(
							'on hitting the exec button, toggled on scheme with response',
							toggleres
						);
						await executeTabScript(currentTabId, tabs[currentTabId].content);
						console.debug('on hitting the exec button, toggling off scheme');
						await toggleScheme(schemeName, false);
						console.debug('on hitting the exec button, toggled off scheme');
					} catch (err) {
						setPollingError(err);
					} finally {
						setExecBlock(false);
					}
				}}
				className={`${buttonStyles.button} ${buttonStyles.menuButton}`}
				disabled={execBlock} //|| hasEmpty(tabs[currentTabId])
				title={
					//hasEmpty(tabs[currentTabId])
					//</div>	? 'В скрипте есть команды с незаполненными полями'
					'Выполнить'
				}
			>
				Выполнить текущий скрипт
			</button>
			<button
				className={`${buttonStyles.button} ${buttonStyles.menuButton}`}
				onClick={e => {
					abortControllers.current[currentTabId].abort();
				}}
			>
				Остановить
			</button>
		</div>
	);
};
export default EditorTabs;
