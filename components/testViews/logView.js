import headerStyles from '@/styles/headerStyles.module.css';
import styles from './editor.module.css';
import ResultsViewWithHighlight from './logListWithHighlights';

const LogView = ({ results, formatter, className = '' }) => {
	return (
		<div className={className}>
			<header className={headerStyles.modalHeader}>
				Результат выполнения:
			</header>
			<ResultsViewWithHighlight
				results={results}
				formatter={formatter}
			></ResultsViewWithHighlight>
		</div>
	);
};
export default LogView;
