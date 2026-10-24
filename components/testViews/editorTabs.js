import React, { createContext, useEffect } from 'react';
import styles from './editor.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import SortableBarEditor from './commandBars/sortableBarEditor';
import { useCommandHooks } from '@/utils/hooks/editorTabHooks/useCommandHooks';
import { useGlobal } from '@/app/GlobalState';

export const errorIDsContext = createContext();
//export const commandHooksContext = createContext();
export const SchemeContext = createContext();
const EditorTabs = ({
	tabs,
	currentTabId,
	updateTabContent,
	setCurrentTabErrorIDs,

	schemeName,
}) => {
	console.info('mounted EditorTabs component');
	const { setPollingError } = useGlobal();
	const setScript = updater => updateTabContent(updater, currentTabId);
	return (
		<div className={styles.showBorderless}>
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
		</div>
	);
};
export default EditorTabs;
