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
	lastCheckTime,
}) {
	return (
		<div>
			<div
				className={`${styles.indicator} ${
					on == true
						? styles.active
						: on == undefined
							? styles.error
							: styles.inactive
				}`}
			></div>

			<span>
				{on == true
					? turnedOnStatusName
					: on == undefined
						? 'Ошибка при получении состояния сигнала'
						: turnedOffStatusName}
			</span>
			{lastCheckTime == null ? '' : <p>Сигнал получен в {lastCheckTime}</p>}
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
