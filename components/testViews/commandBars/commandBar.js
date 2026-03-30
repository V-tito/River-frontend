'use client';
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import styles from './commandBar.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { BarContext } from './barEditor';

const CommandBar = ({ index }) => {
	let {
		formData,
		setFormData,
		current,
		errorIDs,
		isHovered,
		setIsHovered,
		sigsByGroup,
		files,
	} = useContext(BarContext);
	let script = formData;
	let setScript = setFormData;
	let filenames = files;
	console.log('sigs by group in command bar', sigsByGroup);
	console.log(
		'group is undef',
		[undefined, ''].includes(script[index].group),
		'group',
		script[index].group
	);
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
	useEffect(() => {
		if (!sigsByGroup[script[index].group]) {
			setScript(
				script.map((item, i) => (i == index ? { ...item, group: '' } : item))
			);
		}
	}, []);
	useEffect(() => {
		if (sigsByGroup[script[index].group]) {
			if (
				sigsByGroup[script[index].group].sulSigs.find(
					item => item.name == script[index].signal
				) != undefined
			) {
				script[index].sul = 'SulSignal';
			} else {
				if (
					(sigsByGroup[script[index].group].inputs.find(
						item => item.name == script[index].signal
					) !=
						undefined) |
					(sigsByGroup[script[index].group].outputs.find(
						item => item.name == script[index].signal
					) !=
						undefined)
				) {
					script[index].sul = 'Signal';
				} else {
					script[index].signal = '';
				}
			}
			console.log('triggered set sul', script[index]);
		}
	}, [script[index].signal]);
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
			onMouseEnter={() => {
				setIsHovered(index);
			}}
			onMouseLeave={() => setIsHovered(null)}
		>
			<div className={`${buttonStyles.delGrid} ${styles.delGrid}`}>
				<label className={styles.label}>Действие: </label>
				<button
					className={`${buttonStyles.button} ${buttonStyles.closeButton}`}
					onClick={() => setScript(prev => prev.filter((_, i) => i !== index))}
				>
					&times;
				</button>
			</div>
			<select
				id="action"
				value={script[index].action ? script[index].action : ''}
				className={inputStyles.select}
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
								<div key={ind} className={styles.signalGrid}>
									<label className={styles.label}>Группа: </label>
									<select
										value={script[index].group ? script[index].group : ''}
										className={inputStyles.select}
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
									<label className={styles.label}>Сигнал: </label>
									<select
										id={item}
										value={script[index][item] ? script[index][item] : ''}
										className={inputStyles.select}
										onChange={updateScript}
										disabled={[undefined, ''].includes(script[index].group)}
									>
										<option value={''}>сигнал...</option>
										{![undefined, ''].includes(script[index].group) &
										(sigsByGroup != undefined) ? (
											sigsByGroup[script[index].group] != undefined ? (
												script[index]['action'].includes('set') ? (
													sigsByGroup[script[index].group].outputs.map(item => (
														<option value={item.name} key={item.name}>
															{item.name}
														</option>
													))
												) : (
													[
														...sigsByGroup[script[index].group].outputs,
														...sigsByGroup[script[index].group].inputs,
														...sigsByGroup[script[index].group].sulSigs,
													].map(item => (
														<option value={item.name} key={item.name}>
															{item.name}
														</option>
													))
												)
											) : (
												<option value={null}>
													'sigs by group.group undef'
												</option>
											)
										) : (
											<option
												value={null}
											>{`sigs by group ${sigsByGroup} undef or group undef. group: ${script[index].group}`}</option>
										)}
									</select>
								</div>
							) : ['targetValue', 'expectedValue'].includes(item) ? (
								<div key={ind}>
									{![undefined, ''].includes(script[index].group) &
									(sigsByGroup != undefined) ? (
										sigsByGroup[script[index].group] != undefined ? (
											sigsByGroup[script[index].group].sulSigs.find(
												item => item.name == script[index].signal
											) != undefined ? (
												!sigsByGroup[script[index].group].sulSigs.find(
													item => item.name == script[index].signal
												).bool ? (
													<div>
														<label className={styles.label}>
															{translate[item]}:
														</label>
														<input
															className={inputStyles.input}
															type="number"
															id={item}
															value={
																script[index][item] ? script[index][item] : ''
															}
															onChange={updateScript}
														></input>
													</div>
												) : (
													<div>
														<label className={styles.label}>
															{translate[item]}:
														</label>
														<input
															type="radio"
															id={item}
															value={1}
															onChange={updateScript}
															checked={script[index][item] == 1}
															className={`${inputStyles.radio} ${styles.radio}`}
														>
															Активен{' '}
														</input>{' '}
														<input
															className={`${inputStyles.radio} ${styles.radio}`}
															s
															type="radio"
															id={item}
															value={0}
															onChange={updateScript}
															checked={script[index][item] == 0}
														/>{' '}
														Неактивен
													</div>
												)
											) : (
												<div>
													<label className={styles.label}>
														{translate[item]}:
													</label>
													<input
														type="radio"
														className={`${inputStyles.radio} ${styles.radio}`}
														id={item}
														value={1}
														onChange={updateScript}
														checked={script[index][item] == 1}
													/>{' '}
													Активен
													<input
														type="radio"
														className={`${inputStyles.radio} ${styles.radio}`}
														id={item}
														value={0}
														onChange={updateScript}
														checked={script[index][item] == 0}
													/>{' '}
													Неактивен
												</div>
											)
										) : (
											''
										)
									) : (
										''
									)}
								</div>
							) : item == 'script' ? (
								<div key={ind} className="flex flex-row">
									<label className={styles.label}>Скрипт с сервера: </label>
									<select
										value={script[index].script ? script[index].script : ''}
										className={inputStyles.select}
										onChange={updateScript}
										id="script"
									>
										<option value={''}>скрипт...</option>
										{filenames.map(item => (
											<option value={item} key={item}>
												{item}
											</option>
										))}
									</select>
								</div>
							) : (
								<div key={ind}>
									<label className={styles.label}>{translate[item]}:</label>
									<input
										className={inputStyles.input}
										type="number"
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
