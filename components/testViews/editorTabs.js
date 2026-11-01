import React, { createContext, useEffect } from 'react';
import styles from './editor.module.css';

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

	envName,
}) => {
	console.info('mounted EditorTabs component');
	const { setPollingError } = useGlobal();
	const setScript = updater => updateTabContent(updater, currentTabId);
	return (
		<div className={styles.showBorderless}>
			<errorIDsContext.Provider
				value={{
					errorIDs: currentTabId ? tabs[currentTabId].errorIDs : [],
					setErrorIDs: setCurrentTabErrorIDs,
				}}
			>
				<SchemeContext.Provider value={envName}>
					<SortableBarEditor
						formData={currentTabId ? tabs[currentTabId].content : []}
						setFormData={updateTabContent}
						setErrorIDs={setCurrentTabErrorIDs}
						setError={setPollingError}
						blockEditing={
							currentTabId ? tabs[currentTabId].isBeingExecuted : false
						}
						hooks={useCommandHooks(setScript, envName)}
					></SortableBarEditor>
				</SchemeContext.Provider>
			</errorIDsContext.Provider>
		</div>
	);
};
export default EditorTabs;
