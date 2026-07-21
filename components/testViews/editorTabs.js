import React, { createContext, useEffect } from 'react';
import styles from './editor.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import SortableBarEditor from './commandBars/sortableBarEditor';
import { useCommandHooks } from '@/utils/hooks/editorTabHooks/useCommandHooks';
import { useGlobal } from '@/app/GlobalState';
export const errorIDsContext = createContext();
export const commandHooksContext = createContext();
const EditorTabs = ({
	tabs,
	setTabs,
	currentTabId,
	updateTabContent,
	setCurrentTabErrorIDs,
	executeTabScript,
	scheme,
	hasEmpty,
}) => {
	console.info('mounted EditorTabs component');
	const { setPollingError } = useGlobal();
	return (
		<div className={styles.show}>
			<header className={headerStyles.modalHeader}>Редактор команд: </header>
			<commandHooksContext.Provider
				value={useCommandHooks(setTabs, currentTabId, scheme)}
			>
				<errorIDsContext.Provider
					value={currentTabId ? tabs[currentTabId].errorIDs : []}
				>
					<SortableBarEditor
						formData={currentTabId ? tabs[currentTabId].content : []}
						setFormData={updateTabContent}
						setErrorIDs={setCurrentTabErrorIDs}
						setError={setPollingError}
						blockEditing={
							currentTabId ? tabs[currentTabId].isBeingExecuted : false
						}
					></SortableBarEditor>
				</errorIDsContext.Provider>
			</commandHooksContext.Provider>
			<button
				onClick={async e => {
					await executeTabScript(currentTabId, tabs[currentTabId].content);
				}}
				className={`${buttonStyles.button} ${buttonStyles.menuButton}`}
				disabled={hasEmpty(tabs[currentTabId])}
			>
				Выполнить текущий скрипт
			</button>
		</div>
	);
};
export default EditorTabs;
