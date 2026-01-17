'use client';
import React, { useState, useEffect } from 'react';
import styles from './stateIndicator.module.css';
import { useGlobal } from '../../app/GlobalState';
import PropTypes from 'prop-types';
const StateIndicator = ({
	sig,
	showCheckDisplaySettings = false,
	board = false,
}) => {
	const [on, setOn] = useState(false);
	const [responseWaiting, setResponseWaiting] = useState(false);
	const [checkConstantly, setCheck] = useState(true);
	const [lastCheckTime, setLastCheckTime] = useState(null);
	const { setPollingError } = useGlobal();

	useEffect(() => {
		const fetchCurrentState = async () => {
			if (!responseWaiting) {
				setResponseWaiting(true);
				let api;
				try {
					if (board) {
						api = new URL(`${process.env.API_URL}/api/river/v1/protocol/nop`);
						api.searchParams.set('id', sig.id);
					} else {
						api = new URL(`${process.env.API_URL}/api/river/v1/protocol/get`);
						api.searchParams.set('name', sig.name);
					}

					const response = await fetch(api.toString(), {
						method: 'GET',
						headers: { 'Content-Type': 'application/json' },
					});
					console.log(`tried to get state on api ${api.toString()}`);
					if (!response.ok) {
						throw new Error(`Ошибка сети:${response.status}`);
					}
					const result = await response.json();
					console.log('received:', result);
					setPollingError('ok');
					if (!board) {
						setOn(result.b);
						setLastCheckTime(String(result.a.split('.')[0])); //todo actual key
						console.log(
							'with id',
							sig,
							'set state',
							on,
							'with last check time',
							lastCheckTime
						);
					} else {
						setOn(result);
					}
				} catch (err) {
					setPollingError(err);
					console.log('error polling ', api);
					console.log(err);
				} finally {
					setResponseWaiting(false);
				}
			}
		};
		fetchCurrentState();
		console.log('first fetch on page w board=', board);
		if (checkConstantly == true) {
			const intervalId = setInterval(fetchCurrentState, 1000); // Fetch every second
			return () => clearInterval(intervalId);
		}
	}, [
		sig,
		board,
		checkConstantly,
		setPollingError,
		lastCheckTime,
		on,
		responseWaiting,
	]);
	const changeCheckSettings = () => {
		setCheck(prev => !prev);
	};
	console.log('lastchecktime !exists', lastCheckTime == null);
	console.log('lastchecktime is', lastCheckTime);
	return (
		<div>
			<div
				className={`${styles.indicator} ${
					on == true ? styles.active : styles.inactive
				}`}
			></div>
			{showCheckDisplaySettings ? (
				<input
					type="checkbox"
					checked={checkConstantly}
					onChange={changeCheckSettings}
				></input>
			) : (
				''
			)}
			<span>
				{on == true
					? board
						? 'Есть соединение с платой'
						: sig.isStraight
							? sig.turnedOnStatusName
							: sig.turnedOffStatusName
					: board
						? 'Нет соединения с платой'
						: sig.isStraight
							? sig.turnedOffStatusName
							: sig.turnedOnStatusName}
			</span>
			{lastCheckTime == null ? '' : <p>Сигнал получен в {lastCheckTime}</p>}
		</div>
	);
};
//==null||typeof lastCheckTime==='undefined')
StateIndicator.propTypes = {
	sig: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string,
		isStraight: PropTypes.bool.isRequired,
		turnedOnStatusName: PropTypes.string,
		turnedOffStatusName: PropTypes.string,
	}),
	board: PropTypes.bool,
	showCheckDisplaySettings: PropTypes.bool,
};
export default StateIndicator;
