import commonStyles from './common.module.css';
const SetSulButtons = ({ table, sul, setSul }) => {
	const sulLabels = { Signal: 'Сигнал СУЛ', TestBoard: 'СУЛ' };
	const notSulLabels = {
		Signal: 'Сигнал тестовой платы',
		TestBoard: 'Тестовая плата',
	};
	return (
		<div className={commonStyles.buttons}>
			<button
				className={`${commonStyles.button} ${!sul ? commonStyles.active : ''}`}
				onClick={e => setSul(false)}
			>
				{notSulLabels[table]}
			</button>
			<button
				className={`${commonStyles.button} ${sul ? commonStyles.active : ''}`}
				onClick={e => setSul(true)}
			>
				{sulLabels[table]}
			</button>
		</div>
	);
};
export default SetSulButtons;
