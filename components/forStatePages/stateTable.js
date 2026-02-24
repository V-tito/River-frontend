import IndicatorsTable from './indicatorsTable';
import SulSigsTable from './sulSigsTable';
import ButtonsTable from './buttonsTable';
import React from 'react';
import styles from './stateTable.module.css';
import PropTypes from 'prop-types';
const SignalTables = ({ data, group }) => {
	return (
		<div className="flex flex-row">
			<div className="flex flex-col">
				<h2 className={styles.h2}>Входы</h2>
				<IndicatorsTable
					data={data.inputs}
					board={false}
					group={group}
				></IndicatorsTable>
			</div>
			<div className="flex flex-col">
				<h2 className={styles.h2}>Выходы</h2>
				<ButtonsTable data={data.outputs} group={group}></ButtonsTable>
			</div>
			<div className="flex flex-col">
				<h2 className={styles.h2}>Сигналы СУЛ</h2>
				<SulSigsTable
					data={data.sulSigs ? data.sulSigs : []}
					group={group}
				></SulSigsTable>
			</div>
		</div>
	);
};
SignalTables.propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({})),
	group: PropTypes.string,
};
export default SignalTables;
