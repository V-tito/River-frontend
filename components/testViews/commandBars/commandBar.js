'use client';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './commandBar.module.css';

const CommandBar = ({
	script,
	setScript,
	index,
	current,
	error,
	isHovered,
}) => {
	const commandConfig = {
		check: ['signal', 'expectedValue'],
		wait: ['signal', 'expectedValue'],
		set: ['signal', 'targetValue'],
		include: ['script'],
		setPulse: ['signal', 'targetValue', 'pulseTime', 'period'],
		preset: ['signal', 'targetValue'],
		presetPulse: ['signal', 'targetValue', 'pulseTime', 'period'],
		executePresets: [],
		setAll: ['targetValue'],
		presetAll: ['targetValue'],
	};
	const commands = {
		check: 'Сравнить',
		wait: 'Ждать',
		set: 'Установить',
		include: 'Выполнить скрипт',
		setPulse: 'Установить пульсацию',
		preset: 'Предустановить',
		presetPulse: 'Предустановить пульсацию',
		executePresets: 'Запустить предустановленные',
		setAll: 'Установить все',
		presetAll: 'Предустановить все',
	};
	const translate = {
		signal: 'Сигнал',
		targetValue: 'Целевое значение',
		expectedValue: 'Ожидаемое значение',
		pulseTime: 'Длительность импульса',
		period: 'Периодичность импульсов',
	};
	const updateScript = e => {
		setScript(
			script.map((item, i) =>
				i == index ? { ...item, [e.target.id]: e.target.value } : item
			)
		);
	};
	console.log('cb triggered with index', index, 'script', script);
	return (
		<div
			className={`${styles.commandBar} ${current == index ? (error ? styles.error : styles.current) : current > index ? styles.done : styles.upcoming} ${isHovered == index ? styles.active : ''}`}
		>
			<label>Действие: </label>
			<select
				id="action"
				value={script[index].action}
				className={styles.select}
				onChange={updateScript}
			>
				<option value={null}>Действие</option>
				{Object.entries(commands).map(item => (
					<option value={item[0]} key={item[0]}>
						{item[1]}
					</option>
				))}
			</select>
			{script[index].action
				? commandConfig[script[index].action].map((item, ind) => (
						<div key={ind}>
							<label>{translate[item]}</label>
							<input
								className={styles.input}
								type="text"
								id={item}
								value={script[index][item]}
								onChange={updateScript}
							></input>
						</div>
					))
				: ''}
			<button
				className={styles.button}
				onClick={() => setScript(prev => prev.filter((_, i) => i !== index))}
			>
				Удалить команду
			</button>
		</div>
	);
};
CommandBar.propTypes = {
	script: PropTypes.arrayOf(
		PropTypes.shape({
			action: PropTypes.string.isRequired,
			signal: PropTypes.string,
			targetValue: PropTypes.string,
			expectedValue: PropTypes.string,
			pulseTime: PropTypes.string,
			period: PropTypes.string,
		})
	),
	setScript: PropTypes.func,
	index: PropTypes.number,
	current: PropTypes.number,
	error: PropTypes.shape,
	isHovered: PropTypes.number,
};
export default CommandBar;
