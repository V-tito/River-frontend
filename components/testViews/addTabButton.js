import styles from '@/styles/tabHeaderStyles.module.css';

const AddTabButton = ({ addTab }) => {
	return (
		<div className={`${styles.tabAdder}`}>
			<button onClick={() => addTab()} className="">
				+
			</button>
		</div>
	);
};
export default AddTabButton;
