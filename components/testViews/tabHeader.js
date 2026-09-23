import styles from '@/styles/tabHeaderStyles.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import { XCircle } from '@deemlol/next-icons';
const TabHeader = ({
	id,
	name,
	overallCount,
	current,
	setCurrent,
	deleteTab,
}) => {
	return (
		<div
			className={`${styles.tabHeader} ${current == id ? styles.active : styles.inactive}`}
			style={{ width: `min(250px,max(250px, ${100 / overallCount}%))` }}
		>
			<button onClick={e => setCurrent(id)} className={styles.tabName}>
				{name}
			</button>
			<button
				onClick={e => deleteTab(id)}
				className={styles.tabDeleter}
				disabled={overallCount <= 1}
				title={
					overallCount <= 1
						? 'Нельзя закрыть последнюю вкладку'
						: 'Закрыть вкладку'
				}
			>
				<XCircle></XCircle>
			</button>
		</div>
	);
};
export default TabHeader;
