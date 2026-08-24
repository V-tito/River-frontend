'use client';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import styles from './commandBar.module.css';
import colorStyles from '../commandStatusColors.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { BarContext } from './barEditor';
import { errorIDsContext, SchemeContext } from '../editorTabs';
import { execAndMouseDisplayContext } from '../editor';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { Sortable } from '@dnd-kit/dom/sortable';
import {
	CommandAction,
	commandTypeCheckers,
} from '@/utils/hooks/command/command';
import { CommandBarHelpers } from '@/utils/hooks/command/commandBarHelpers';
import { Copy } from '@deemlol/next-icons';
import { useCommandHooks } from '@/utils/hooks/editorTabHooks/useCommandHooks';

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
				onChange={e => {
					console.debug('setting value', 0);
					updateAction(e);
					console.log(
						'value',
						command[fieldName],
						'bool',
						Boolean(command[fieldName])
					);
				}}
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
						disabled={disabled}
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
				id="scriptPath"
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

const FatalCheckbox = ({ command, fieldName, updateAction, disabled }) => {
	return (
		<div>
			<label>
				<input
					type="checkbox"
					id={fieldName}
					checked={command.fatal}
					onChange={updateAction}
					disabled={disabled}
				/>
				Прекратить исполнение скрипта при отрицательном результате
				{command.waitForSignal}
			</label>
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
const IterateEditorWindow = ({
	command,
	fieldName,
	setErrorIDs,
	setScript,
	commandIndex,
	disabled,
}) => {
	const schemeName = useContext(SchemeContext);
	const formData = command[fieldName];
	const [version, setVersion] = useState(0);
	const hooks = useCommandHooks(setScript, schemeName);
	console.debug('setScript in iterate component', setScript);
	return (
		<div style={{ width: '80%', placeSelf: 'center' }}>
			<ul>
				<DragDropProvider
					key={version}
					onDragEnd={event => {
						if (event.canceled) return;
						const { source } = event.operation;
						const { initialIndex, index } = source;
						if (initialIndex !== index) {
							const newData = [...command[fieldName]];
							const [removed] = newData.splice(initialIndex, 1);
							newData.splice(index, 0, removed);
							updateAction(commandIndex, fieldName, newData);
							setErrorIDs(prev =>
								prev.map(item =>
									item == initialIndex
										? index
										: initialIndex > index
											? (item >= index) & (item < initialIndex)
												? item + 1
												: item
											: (item > initialIndex) & (item <= index)
												? item - 1
												: item
								)
							);
							setVersion(prev => prev + 1);
						}
						//
					}}
				>
					{command[fieldName].length > 0
						? command[fieldName].map((item, i) => {
								//const { ref } = useSortable({ id: i, index: i });
								console.debug(
									'setScript in mapping function in cycle',
									setScript
								);
								return (
									//<li ref={ref} key={i} className="flex flex-col w-full">
									<CommandBar
										key={i}
										index={i}
										script={command[fieldName]}
										setScript={setScript}
										blockEditing={disabled}
										hooks={hooks}
									></CommandBar>
									//</li>
								);
							})
						: ''}
				</DragDropProvider>
			</ul>
			<button
				className={`${buttonStyles.button} ${buttonStyles.menuButton} w-full`}
				onClick={e => hooks.addCommandToScript(formData.length)}
			>
				Добавить
			</button>
		</div>
	);
};
const CommandBar = ({
	index,
	script,
	setScript,
	hooks,
	blockEditing = false,
}) => {
	console.debug;
	console.debug('script in commandBar', script);
	console.debug('setScript in commandBar', setScript);
	const { sigsByGroup, files } = useContext(BarContext);
	const command = script[index];
	console.info('mounted CommandBar component with id', command.id);
	const { isHovered, setIsHovered, current } = useContext(
		execAndMouseDisplayContext
	);
	const { errorIDs, setErrorIDs } = useContext(errorIDsContext);
	const {
		deleteCommandFromScript,
		changeCommandActionType,
		updateCommandField,
		autoUpdateCommandSignalSubtype,
		autoCleanCommand,
		addCommandCopy,
	} = hooks;

	useEffect(() => {
		autoCleanCommand(index, sigsByGroup);
	}, []);
	useEffect(() => {
		autoUpdateCommandSignalSubtype(index, sigsByGroup);
	}, [command.signal]);
	useEffect(() => {
		return () =>
			console.info('unmounted CommandBar component with id', command.id);
	}, []);
	const updateScript = e => {
		updateCommandField(
			index,
			e.target.id,
			e.target.id == 'fatal' ? e.target.checked : e.target.value
		);
	};
	const UpdateScriptInCycle = updater => {
		console.debug('setScript in commandBar', setScript);
		return setScript(prev =>
			prev.map((item, i) => {
				console.debug('prev in setScript', prev);
				console.debug('typeof updater in setScript', typeof updater);
				console.debug('updater in setScript', updater);
				return i == index
					? 'iteratorContent' in item
						? typeof updater == 'function'
							? { ...item, iteratorContent: updater(item.iteratorContent) }
							: { ...item, iteratorContent: updater }
						: item
					: item;
			})
		);
	};
	return (
		<div
			className={`${styles.commandBar} ${errorIDs.includes(index) ? colorStyles.error : current == index ? colorStyles.current : current > index ? colorStyles.done : colorStyles.upcoming} ${isHovered == command.id ? colorStyles.active : ''}`}
			onMouseEnter={() => {
				setIsHovered(command.id);
			}}
			onMouseLeave={() => {
				setIsHovered(null);
				console.debug('in commandBar, set IsHovered to null');
			}}
		>
			<div className={`${buttonStyles.delCopyGrid} ${styles.delGrid}`}>
				<label className={styles.label}>Действие: </label>
				<button
					className={buttonStyles.button}
					onClick={() => addCommandCopy(index)}
				>
					<Copy color="#000000"></Copy>
				</button>
				<DelScriptButton
					delAction={() => deleteCommandFromScript(index)}
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
				) : item == 'scriptPath' ? (
					<ScriptSelection
						key={ind}
						command={command}
						updateAction={updateScript}
						filenames={files}
						disabled={blockEditing}
					></ScriptSelection>
				) : item == 'fatal' ? (
					<FatalCheckbox
						command={command}
						updateAction={updateScript}
						fieldName={item}
						key={ind}
						disabled={blockEditing}
					/>
				) : item == 'iteratorContent' ? (
					<IterateEditorWindow
						command={command}
						fieldName={item}
						setScript={UpdateScriptInCycle}
						key={ind}
						commandIndex={index}
						disabled={blockEditing}
						setErrorIDs={setErrorIDs}
					></IterateEditorWindow>
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
