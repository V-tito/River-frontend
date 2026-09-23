import { toggleScheme } from '@/utils/api_wrap/protocol';
import { PlayCircle, StopCircle } from '@deemlol/next-icons';
import buttonStyles from '@/styles/buttonStyles.module.css';
import styles from './editor.module.css';
import React from 'react';
function ExecCurrentButtons({
	setExecBlock,
	executeTabScript,
	schemeName,
	currentTabId,
	tabs,
	setPollingError,
	execBlock,
	abortControllers,
}) {
	return (
		<div className={styles.buttons}>
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
				className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
				disabled={execBlock} //|| hasEmpty(tabs[currentTabId])
				title="Выполнить текущий скрипт"
			>
				<PlayCircle />
			</button>
			<button
				className={`${buttonStyles.button} ${buttonStyles.buttonFlex} ${buttonStyles.menuButton}`}
				onClick={e => {
					abortControllers.current[currentTabId].abort();
				}}
				title="Остановить"
			>
				<StopCircle />
			</button>
		</div>
	);
}

export default ExecCurrentButtons;
