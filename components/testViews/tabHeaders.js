import tabStyles from '@/styles/tabHeaderStyles.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import { toggleScheme } from '@/utils/api_wrap/protocol';
import TabHeader from './tabHeader';
import AddTabButton from './addTabButton';
import { FastForward, Pause, StopCircle } from '@deemlol/next-icons';
function TabHeaders({
	schemeName,
	execBlock,
	setExecBlock,
	executeTabScript,
	abortControllers,
	tabs,
	currentTabId,
	setCurrentTabId,
	deleteTab,
	addTab,
}) {
	return (
		<div className={tabStyles.tabHeaders}>
			<button
				className={tabStyles.execButton}
				disabled={execBlock}
				title="Выполнить все"
				onClick={async e => {
					setExecBlock(true);
					//console.debug('on hitting the ExecAll button, toggling on scheme');
					//await toggleScheme(schemeName);
					//console.debug('on hitting the ExecAll button, toggled on scheme');
					const all = Object.keys(tabs).map(
						async tabID => await executeTabScript(tabID, tabs[tabID].content)
					);
					await Promise.all(all);
					//console.debug('on hitting the ExecAll button, toggling off scheme');
					//await toggleScheme(schemeName, false);
					//console.debug('on hitting the ExecAll button, toggled off scheme');
					setExecBlock(false);
				}}
			>
				<FastForward></FastForward>
			</button>
			<button
				className={tabStyles.execButton}
				onClick={e => {
					Object.keys(abortControllers.current).map(id => {
						abortControllers.current[id].abort();
					});
				}}
				title="Остановить все"
			>
				<StopCircle></StopCircle>
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
	);
}
export default TabHeaders;
