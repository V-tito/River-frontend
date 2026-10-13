import { Loader } from '@deemlol/next-icons';
import styles from '../controlPanel.module.css';
export default function CPload() {
	return (
		<div className={styles.loader}>
			<Loader size={128} />
		</div>
	);
}
