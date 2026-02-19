import IndicatorsTable from './indicatorsTable';
import ButtonsTable from './buttonsTable';
import React from 'react';
import styles from './stateTable.module.css';
import PropTypes from 'prop-types';
const SignalTables = ({ data, group }) => {
	return (
		<div className="flex flex-row">
			<div className="flex flex-col">
				<h2 className={styles.h2}>Входы</h2>
				<IndicatorsTable data={data.inputs} board={false}></IndicatorsTable>
			</div>
			<div className="flex flex-col">
				<h2 className={styles.h2}>Выходы</h2>
				<ButtonsTable data={data.outputs} group={group}></ButtonsTable>
			</div>
		</div>
	);
};
SignalTables.propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({})),
	group: PropTypes.string,
};
export default SignalTables;
