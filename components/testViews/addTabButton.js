import styles from '@/styles/tabHeaderStyles.module.css';
import { PlusCircle } from '@deemlol/next-icons';
const AddTabButton = ({ addTab }) => {
	return (
		<button className={`${styles.tabAdder}`} onClick={() => addTab()}>
			<PlusCircle />
		</button>
	);
};
export default AddTabButton;
