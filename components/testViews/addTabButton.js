import styles from '@/styles/tabHeaderStyles.module.css';

const AddTabButton = ({ addTab }) => {
	return (
		<button className={`${styles.tabAdder}`} onClick={() => addTab()}>
			+
		</button>
	);
};
export default AddTabButton;
