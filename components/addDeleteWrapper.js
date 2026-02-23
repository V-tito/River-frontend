import AddForm from './forms/addForm';
import DeleteForm from './forms/deleteForm';
import styles from './addDeleteWrapper.module.css';
import commonStyles from './common.module.css';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const AddDeleteWrapper = ({ table, children }) => {
	const [sul, setSul] = useState(false);
	const [type, setType] = useState(table);
	useEffect(() => {
		if (sul) {
			if (table == 'Signal') setType('SulSignal');
			if (table == 'TestBoard') setType('Sul');
		}
		if (!sul) {
			if (table == 'Signal') setType('Signal');
			if (table == 'TestBoard') setType('TestBoard');
		}
	}, [sul]);
	// className={styles.asideButtons} for aside when buttons
	return (
		<div className={styles.wrap}>
			<div className={styles.main}>{children}</div>
			<aside className={styles.asideForms}>
				<div>
					{table == 'Signal' ? (
						<div>
							<button
								className={`${commonStyles.button} ${!sul ? commonStyles.active : ''} w-50%`}
								onClick={e => setSul(false)}
							>
								Сигнал тестовой платы
							</button>
							<button
								className={`${commonStyles.button} ${sul ? commonStyles.active : ''} w-50%`}
								onClick={e => setSul(true)}
							>
								Сигнал СУЛ
							</button>
						</div>
					) : (
						''
					)}
					{table == 'TestBoard' ? (
						<div>
							<button
								className={`${commonStyles.button} ${!sul ? commonStyles.active : ''} w-50%`}
								onClick={e => setSul(false)}
							>
								Тестовая плата
							</button>
							<button
								className={`${commonStyles.button} ${sul ? commonStyles.active : ''} w-50%`}
								onClick={e => setSul(true)}
							>
								СУЛ
							</button>
						</div>
					) : (
						''
					)}
					<AddForm table={type}></AddForm>
				</div>
			</aside>
		</div>
	);
};
AddDeleteWrapper.propTypes = {
	table: PropTypes.string.isRequired,
	listOfAll: PropTypes.arrayOf(PropTypes.shape({})),
	children: PropTypes.node,
};

export default AddDeleteWrapper;
//bebebebababa
//thank fuck
