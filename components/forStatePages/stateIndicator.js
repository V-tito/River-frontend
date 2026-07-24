'use client';
import React from 'react';
import styles from './stateIndicator.module.css';
import { memo } from 'react';
import PropTypes from 'prop-types';

/*{showCheckDisplaySettings ? (
	<input
		type="checkbox"
		checked={checkConstantly}
		onChange={changeCheckSettings}
	></input>
) : (
	''
)}*/
const StateIndicator = memo(function StateIndicator({
	on,
	turnedOnStatusName,
	turnedOffStatusName,
	lastCheckTime = null,
	unknownStatusName = 'Ошибка при получении состояния',
}) {
	return (
		<div className="flex flex-row">
			<div
				className={`${styles.indicator} ${
					on == undefined || on < 0
						? styles.error
						: on != 0
							? styles.active
							: styles.inactive
				}`}
			></div>

			<span className={styles.indicatorLabel}>
				{on == undefined || on < 0
					? unknownStatusName
					: on == 1
						? turnedOnStatusName
						: turnedOffStatusName}
			</span>
			<span className={styles.indicatorLabel}>
				{lastCheckTime == null ? '' : <p>Сигнал получен в {lastCheckTime}</p>}
			</span>
		</div>
	);
});
StateIndicator.propTypes = {
	on: PropTypes.bool,
	lastCheckTime: PropTypes.string,
	showCheckDisplaySettings: PropTypes.bool,
	turnedOnStatusName: PropTypes.string,
	turnedOffStatusName: PropTypes.string,
};
export default StateIndicator;
