import headerStyles from '@/styles/headerStyles.module.css';
import styles from './editor.module.css';
import ResultsViewWithHighlight from './resultsViewWithHighlight';

const ResultTabs = ({ results }) => {
	return (
		<div className={styles.show}>
			<header className={headerStyles.modalHeader}>
				Результат выполнения:{' '}
			</header>
			<ResultsViewWithHighlight results={results}></ResultsViewWithHighlight>
		</div>
	);
};
export default ResultTabs;
