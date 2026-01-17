'use client';
import React, { useState, useEffect } from 'react';
import Modal from '../modals/inlineModal';
import styles from './stateButton.module.css';
import PropTypes from 'prop-types';
const StateButton = ({ sig }) => {
	const [error, setError] = useState(null);
	const [on, setOn] = useState(() => {
		const savedVariable = localStorage.getItem(`Signal_${sig.id}_state`);
		if (savedVariable) {
			console.log('got saved', savedVariable, 'for sig', sig.id);
			return savedVariable != null ? savedVariable === 'true' : false;
		}
	});

	useEffect(() => {
		localStorage.setItem(`Signal_${sig.id}_state`, on);
		console.log('saved', on, 'for sig', sig.id);
	}, [sig, on]);
	const changeState = async () => {
		try {
			const api = new URL(`${process.env.API_URL}/api/river/v1/protocol/set`);
			api.searchParams.set('name', sig.name);
			api.searchParams.set('value', !on);
			const response = await fetch(api, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});
			console.log(
				`tried to set signal state with ${JSON.stringify({
					id: sig.id,
					currentValue: !on,
				})}`
			);
			if (!response.ok) {
				throw new Error(`Ошибка сети ${response.status}`);
			} else {
				setOn(!on);
			}
		} catch (err) {
			console.log(err);
			setError(err);
		}
	};
	console.log('state', on, 'for sig', sig.id);
	return (
		<div>
			<button
				className={`${styles.button} ${on == true ? styles.on : styles.off}`}
				onClick={changeState}
			>
				{on == true ? 'Вкл.' : 'Выкл.'}
			</button>
			<p>
				{on
					? sig.isStraight
						? sig.turnedOnStatusName
						: sig.turnedOffStatusName
					: sig.isStraight
						? sig.turnedOffStatusName
						: sig.turnedOnStatusName}
			</p>
			<Modal state={error}>{error ? error.message : ''}</Modal>
		</div>
	);
};
StateButton.propTypes = {
	sig: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		isStraight: PropTypes.bool.isRequired,
		turnedOnStatusName: PropTypes.string,
		turnedOffStatusName: PropTypes.string,
	}),
};

export default StateButton;
