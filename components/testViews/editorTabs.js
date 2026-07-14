import React, { createContext, useEffect } from 'react';
import styles from './editor.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import SortableBarEditor from './commandBars/sortableBarEditor';
import { useCommandHooks } from '@/utils/hooks/tabGodObject';
import { useGlobal } from '@/app/GlobalState';
export const errorIDsContext = createContext();
export const commandHooksContext = createContext();
const EditorTabs = ({
	tabs,
	setTabs,
	currentTabId,
	updateCurrentTabContent,
	setCurrentTabErrorIDs,
	executeTabScript,
	scheme,
	toggleScheme,
}) => {
	const { setPollingError } = useGlobal();
	console.log(
		'updateCurrentTabContent in editor tabs is',
		updateCurrentTabContent
	);
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
						setFormData={updateCurrentTabContent}
						setErrorIDs={setCurrentTabErrorIDs}
						setError={setPollingError}
					></SortableBarEditor>
				</errorIDsContext.Provider>
			</commandHooksContext.Provider>
			<button
				onClick={async e => {
					//await toggleScheme(scheme);
					//console.debug('toggled scheme on');
					await executeTabScript(currentTabId, tabs[currentTabId].content);
					//await toggleScheme(scheme, false);
				}}
				className={`${buttonStyles.button} ${buttonStyles.menuButton}`}
			>
				Выполнить текущий скрипт
			</button>
		</div>
	);
};
export default EditorTabs;
