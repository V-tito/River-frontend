'use client';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './commandBar.module.css';

const CommandBar = ({
	script,
	setScript,
	index,
	current,
	errorIDs,
	isHovered,
	sigsByGroup,
}) => {
	console.log('sigs by group', sigsByGroup);
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
		group: 'группа',
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
			className={`${styles.commandBar} ${errorIDs.includes(index) ? styles.error : current == index ? styles.current : current > index ? styles.done : styles.upcoming} ${isHovered == index ? styles.active : ''}`}
		>
			<div className="flex flex-row w-full">
				<label className={styles.label}>Действие </label>
				<div className={styles.deleteContainer}>
					<button
						className={styles.button}
						onClick={() =>
							setScript(prev => prev.filter((_, i) => i !== index))
						}
					>
						&times;
					</button>
				</div>
			</div>
			<select
				id="action"
				value={script[index].action ? script[index].action : ''}
				className={styles.select}
				onChange={updateScript}
			>
				<option value={''}>Действие</option>
				{Object.entries(commands).map(item => (
					<option value={item[0]} key={item[0]}>
						{item[1]}
					</option>
				))}
			</select>
			{script[index].action
				? script[index].action !== ''
					? commandConfig[script[index].action].map((item, ind) =>
							item == 'signal' ? (
								<div key={ind} className="flex flex-row">
									<label className={styles.label}>Группа </label>
									<select
										value={script[index].group ? script[index].group : ''}
										className={styles.select}
										onChange={updateScript}
										id="group"
									>
										<option value={''}>группа...</option>
										{sigsByGroup
											? Object.keys(sigsByGroup).map(item => (
													<option value={item} key={item}>
														{item}
													</option>
												))
											: ''}
									</select>
									<label className={styles.label}>Сигнал </label>
									<select
										id={item}
										value={script[index][item] ? script[index][item] : ''}
										className={styles.select}
										onChange={updateScript}
										disabled={![undefined, ''].includes(script[index].group)}
									>
										<option value={''}>сигнал...</option>
										{![undefined, ''].includes(script[index].group)
											? script[index]['action'].includes('set')
												? sigsByGroup[script[index].group].outputs.map(item => (
														<option value={item} key={item}>
															{item}
														</option>
													))
												: [
														...sigsByGroup[script[index].group].outputs,
														...sigsByGroup[script[index].group].inputs,
													].map(item => (
														<option value={item} key={item}>
															{item}
														</option>
													))
											: ''}
									</select>
								</div>
							) : (
								<div key={ind}>
									<label className={styles.label}>{translate[item]}</label>
									<input
										className={styles.input}
										type="text"
										id={item}
										value={script[index][item] ? script[index][item] : ''}
										onChange={updateScript}
									></input>
								</div>
							)
						)
					: ''
				: ''}
		</div>
	);
};
CommandBar.propTypes = {
	script: PropTypes.arrayOf(
		PropTypes.shape({
			action: PropTypes.string.isRequired,
			group: PropTypes.string,
			signal: PropTypes.string,
			targetValue: PropTypes.string,
			expectedValue: PropTypes.string,
			pulseTime: PropTypes.string,
			period: PropTypes.string,
		})
	).isRequired,
	setScript: PropTypes.func.isRequired,
	index: PropTypes.number,
	current: PropTypes.number,
	errorIDs: PropTypes.arrayOf(PropTypes.number),
	isHovered: PropTypes.number,
	sigsByGroup: PropTypes.shape.isRequired,
};
export default CommandBar;
