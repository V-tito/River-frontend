'use client';
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import styles from './commandBar.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { BarContext } from './barEditor';
import { errorIDsContext, commandHooksContext } from '../editorTabs';
import { execAndMouseDisplayContext } from '../editor';
import {
	CommandAction,
	commandTypeCheckers,
} from '@/utils/hooks/command/command';
import { CommandBarHelpers } from '@/utils/hooks/command/commandBarHelpers';

const { translateFields, isSetter, getConfig } = CommandBarHelpers;

const DelScriptButton = ({ delAction, disabled }) => {
	return (
		<button
			className={`${buttonStyles.button} ${buttonStyles.closeButton}`}
			onClick={delAction}
			disabled={disabled}
		>
			&times;
		</button>
	);
};
const ActionPicker = ({ actRef, changeAction, disabled }) => {
	console.debug('action picker triggered');
	return (
		<select
			id="action"
			value={actRef}
			className={inputStyles.select}
			onChange={changeAction}
			disabled={disabled}
		>
			{Object.values(CommandAction)
				.filter(
					val => val != CommandAction.setAll && val != CommandAction.presetAll
				)
				.map(item =>
					(item != CommandAction.none) | (actRef == CommandAction.none) ? (
						<option value={item} key={item}>
							{item}
						</option>
					) : (
						''
					)
				)}
		</select>
	);
};
const CheckIfSigsAreNotUndef = (command, sigtable) => {
	if (![undefined, ''].includes(command.group) & (sigtable != undefined))
		if (sigtable[command.group] != undefined) return true;
	return false;
};
const GroupSignalSelection = ({
	command,
	sigtable,
	updateAction,
	disabled,
}) => {
	const listOfSignals = CheckIfSigsAreNotUndef(command, sigtable)
		? isSetter(command)
			? sigtable[command.group].outputs
			: [
					//...sigtable[command.group].outputs,
					...sigtable[command.group].inputs,
					...sigtable[command.group].sulSigs,
				]
		: [null];
	return (
		<div className={styles.signalGrid}>
			<label className={styles.label}>Группа: </label>
			<select
				value={command.group}
				className={inputStyles.select}
				onChange={updateAction}
				id="group"
			>
				{command.group == '' ? <option value={''}>группа...</option> : ''}
				{sigtable
					? Object.keys(sigtable).map(item => (
							<option value={item} key={item}>
								{item}
							</option>
						))
					: ''}
			</select>
			<label className={styles.label}>Сигнал: </label>
			<select
				id="signal"
				value={command.signal}
				className={inputStyles.select}
				onChange={updateAction}
				disabled={[undefined, ''].includes(command.group) || disabled}
			>
				{command.signal == '' ? <option value={''}>сигнал...</option> : ''}
				{listOfSignals.map(item =>
					item != null ? (
						<option value={item.name} key={item.name}>
							{item.name}
						</option>
					) : (
						<option key={Date.now()} value={null}>
							Ошибка при получении списка сигналов
						</option>
					)
				)}
			</select>
		</div>
	);
};
const ValueRadio = ({ command, fieldName, updateAction, disabled }) => {
	return (
		<div>
			<label className={styles.label}>{translateFields[fieldName]}:</label>
			<input
				type="radio"
				id={fieldName}
				value={1}
				onChange={updateAction}
				checked={command[fieldName] == 1}
				className={`${inputStyles.radio} ${styles.radio}`}
				disabled={disabled}
			/>
			Активен{' '}
			<input
				className={`${inputStyles.radio} ${styles.radio}`}
				type="radio"
				id={fieldName}
				value={0}
				onChange={updateAction}
				checked={command[fieldName] == 0}
				disabled={disabled}
			/>{' '}
			Неактивен
		</div>
	);
};
const ValueInput = ({
	command,
	fieldName,
	sigtable,
	updateAction,
	disabled,
}) => {
	const isRadio =
		command.signalSubtype == 'SulSignal'
			? !sigtable[command.group].sulSigs.find(
					item => item.name == command.signal
				).bool
				? false
				: true
			: true;

	if (CheckIfSigsAreNotUndef(command, sigtable))
		return (
			<div>
				{isRadio ? (
					<ValueRadio
						command={command}
						fieldName={fieldName}
						updateAction={updateAction}
					></ValueRadio>
				) : (
					<div>
						<label className={styles.label}>
							{translateFields[fieldName]}:
						</label>
						<input
							className={inputStyles.input}
							type="number"
							id={fieldName}
							value={command[fieldName] ? command[fieldName] : ''}
							onChange={updateScript}
							disabled={disabled}
						></input>
					</div>
				)}
			</div>
		);
	else return;
};
const ScriptSelection = ({ command, updateAction, filenames, disabled }) => {
	return (
		<div className="flex flex-row">
			<label className={styles.label}>Скрипт с сервера: </label>
			<select
				value={command.scriptPath}
				className={inputStyles.select}
				onChange={updateAction}
				disabled={disabled}
				id="script"
			>
				{command.scriptPath == '' ? <option value={''}>скрипт...</option> : ''}
				{filenames.map(item => (
					<option value={item} key={item}>
						{item}
					</option>
				))}
			</select>
		</div>
	);
};

const GenInput = ({ command, fieldName, updateAction, disabled }) => {
	return (
		<div>
			<label className={styles.label}>{translateFields[fieldName]}:</label>
			<input
				className={inputStyles.input}
				type="number"
				id={fieldName}
				value={command[fieldName]}
				onChange={updateAction}
				disabled={disabled}
			></input>{' '}
		</div>
	);
};
const CommandBar = ({ index, blockEditing = false }) => {
	const { formData, sigsByGroup, files } = useContext(BarContext);
	let script = formData;
	let command = script[index];
	console.debug('script in command bar', script);
	const { isHovered, setIsHovered, current } = useContext(
		execAndMouseDisplayContext
	);
	const errorIDs = useContext(errorIDsContext);
	console.log('errorIDs context in command bar', errorIDs);
	const {
		deleteCommandFromCurrentTab,
		changeCommandActionType,
		updateCommandField,
		autoUpdateCommandSignalSubtype,
		autoCleanCommand,
	} = useContext(commandHooksContext);
	console.log('sigs by group in command bar', sigsByGroup);
	console.log(
		'group is undef',
		[undefined, ''].includes(command.group),
		'group',
		command.group
	);

	useEffect(() => {
		autoCleanCommand(index, sigsByGroup);
	}, []);
	useEffect(() => {
		autoUpdateCommandSignalSubtype(index, sigsByGroup);
	}, [command.signal]);
	const updateScript = e => {
		console.debug(
			'updating script with ',
			script[index],
			e.target.id,
			e.target.value
		);
		updateCommandField(index, e.target.id, e.target.value);
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
				<DelScriptButton
					delAction={() => deleteCommandFromCurrentTab(index)}
					disabled={blockEditing}
				></DelScriptButton>
			</div>
			<ActionPicker
				actRef={command.action}
				changeAction={e => changeCommandActionType(index, e.target.value)}
				disabled={blockEditing}
			></ActionPicker>
			{getConfig(command).map((item, ind) =>
				item == 'signal' ? (
					<GroupSignalSelection
						key={ind}
						command={command}
						sigtable={sigsByGroup}
						updateAction={updateScript}
						disabled={blockEditing}
					></GroupSignalSelection>
				) : ['targetValue', 'expectedValue'].includes(item) ? (
					<ValueInput
						key={ind}
						command={command}
						fieldName={item}
						sigtable={sigsByGroup}
						updateAction={updateScript}
						disabled={blockEditing}
					></ValueInput>
				) : item == 'script' ? (
					<ScriptSelection
						key={ind}
						command={command}
						updateAction={updateScript}
						filenames={files}
						disabled={blockEditing}
					></ScriptSelection>
				) : (
					<GenInput
						command={command}
						updateAction={updateScript}
						fieldName={item}
						key={ind}
						disabled={blockEditing}
					></GenInput>
				)
			)}
		</div>
	);
};
CommandBar.propTypes = {
	index: PropTypes.number,
};
export default CommandBar;
