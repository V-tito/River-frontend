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

const DelScriptButton = ({ delAction }) => {
	return (
		<button
			className={`${buttonStyles.button} ${buttonStyles.closeButton}`}
			onClick={delAction}
		>
			&times;
		</button>
	);
};
const ActionPicker = ({ actRef, changeAction }) => {
	return (
		<select
			id="action"
			value={actRef}
			className={inputStyles.select}
			onChange={changeAction}
		>
			{Object.values(CommandAction).map(item =>
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
const GroupSignalSelection = ({ command, sigtable, updateAction }) => {
	const listOfSignals = CheckIfSigsAreNotUndef(command, sigtable)
		? isSetter(command)
			? sigtable[command.group].outputs
			: [
					//...sigtable[command.group].outputs,
					...sigtable[command.group].inputs,
					...sigtable[command.group].sulSigs,
				]
		: [null];
	const displayed = commandTypeCheckers.isWait(command)
		? command.waitForSignal
		: true;
	return displayed ? (
		<div className={styles.signalGrid}>
			<label className={styles.label}>Группа: </label>
			<select
				value={command.group}
				className={inputStyles.select}
				onChange={updateAction}
				id="group"
			>
				<option value={''}>группа...</option>
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
				disabled={[undefined, ''].includes(command.group)}
			>
				<option value={''}>сигнал...</option>
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
	) : (
		''
	);
};
const ValueRadio = ({ command, fieldName, updateAction }) => {
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
			/>
			Активен{' '}
			<input
				className={`${inputStyles.radio} ${styles.radio}`}
				type="radio"
				id={fieldName}
				value={0}
				onChange={updateAction}
				checked={command[fieldName] == 0}
			/>{' '}
			Неактивен
		</div>
	);
};
const ValueInput = ({ command, fieldName, sigtable, updateAction }) => {
	const isRadio =
		command.signalSubtype == 'SulSignal'
			? !sigtable[command.group].sulSigs.find(
					item => item.name == command.signal
				).bool
				? false
				: true
			: true;
	const displayed = commandTypeCheckers.isWait(command)
		? command.waitForSignal
		: true;

	if (CheckIfSigsAreNotUndef(command, sigtable) && displayed)
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
						></input>
					</div>
				)}
			</div>
		);
	else return;
};
const ScriptSelection = ({ command, updateAction, filenames }) => {
	return (
		<div className="flex flex-row">
			<label className={styles.label}>Скрипт с сервера: </label>
			<select
				value={command.script}
				className={inputStyles.select}
				onChange={updateAction}
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
	);
};
const WaitCheckbox = ({ command, updateAction }) => {
	return (
		<div>
			<label>
				<input
					type="checkbox"
					id={'waitForSignal'}
					checked={command.waitForSignal}
					onChange={updateAction}
				/>
				Ждать состояния сигнала
				{command.waitForSignal}
			</label>
		</div>
	);
};
const GenInput = ({ command, fieldName, updateAction }) => {
	return (
		<div>
			<label className={styles.label}>{translateFields[fieldName]}:</label>
			<input
				className={inputStyles.input}
				type="number"
				id={fieldName}
				value={command[fieldName]}
				onChange={updateAction}
			></input>{' '}
		</div>
	);
};
const CommandBar = ({ index }) => {
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
		markIfEntryHasEmptyFields,
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
				></DelScriptButton>
			</div>
			<ActionPicker
				actRef={command.action}
				changeAction={e => changeCommandActionType(index, e.target.value)}
			></ActionPicker>
			{getConfig(command).map((item, ind) =>
				item == 'signal' ? (
					<GroupSignalSelection
						key={ind}
						command={command}
						sigtable={sigsByGroup}
						updateAction={updateScript}
					></GroupSignalSelection>
				) : ['targetValue', 'expectedValue'].includes(item) ? (
					<ValueInput
						key={ind}
						command={command}
						fieldName={item}
						sigtable={sigsByGroup}
						updateAction={updateScript}
					></ValueInput>
				) : item == 'script' ? (
					<ScriptSelection
						key={ind}
						command={command}
						updateAction={updateScript}
						filenames={files}
					></ScriptSelection>
				) : item == 'waitForSignal' ? (
					<WaitCheckbox
						command={command}
						updateAction={e => {
							console.debug(
								'e.val',
								e.target.value,
								'of type',
								typeof e.target.value
							);
							updateCommandField(index, e.target.id, e.target.checked);
						}}
						key={ind}
					></WaitCheckbox>
				) : (
					<GenInput
						command={command}
						updateAction={updateScript}
						fieldName={item}
						key={ind}
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
