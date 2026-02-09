import styles from './stateTable.module.css';
import StateButton from './stateButton';
import React from 'react';
import PropTypes from 'prop-types';
const ButtonsTable = ({ data }) => {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th className={styles.th}>Имя</th>
					<th className={styles.th}>Состояние</th>
				</tr>
			</thead>
			<tbody>
				{data.length > 0 ? (
					data.map(item => (
						<tr key={item.id}>
							<td className={`${styles.td} ${styles.namer}`}>{item.name}</td>
							<td className={styles.td}>
								<StateButton sig={item}></StateButton>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan="2" className={styles.td}>
							Данных нет
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};
ButtonsTable.propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({})),
};
export default ButtonsTable;
