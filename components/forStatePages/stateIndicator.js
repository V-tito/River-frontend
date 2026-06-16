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
					on == undefined
						? styles.error
						: on != 0
							? styles.active
							: styles.inactive
				}`}
			></div>

			<span>
				{on == undefined
					? 'Ошибка при получении состояния'
					: on != 0
						? turnedOnStatusName
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
