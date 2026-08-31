'use client';
//libs
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
//styling
import { Copy } from '@deemlol/next-icons';
import styles from './commandBar.module.css';
import colorStyles from '../commandStatusColors.module.css';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
//contexts
import { BarContext } from './barEditor';
import { errorIDsContext, SchemeContext } from '../editorTabs';
import { execAndMouseDisplayContext } from '../editor';
//hooks
import { useCommandHooks } from '@/utils/hooks/editorTabHooks/useCommandHooks';
import { CommandBarHelpers } from '@/utils/hooks/command/commandBarHelpers';
import fields from './fields/index.js';

const { getConfig } = CommandBarHelpers;
//field components (except for loops)
const {
	ActionPicker,
	FatalCheckbox,
	GenInput,
	ScriptSelection,
	SelectGroupAndSignal,
	SetAll,
	SingleSignalValueInput,
} = fields;

const DelCommandButton = ({ delAction, disabled }) => {
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

/**
 * CAN'T BE MOVED FROM THE COMMAND BAR FILE DUE TO CIRCULAR IMPORT REASONS (renders commandBars recursively);
 * used for setting up a loop (its script and number of iterations). so far only "for" loops, no bool loops. doesn't support sortable commands due to react not handling conditional initializing of an extra dnd context well
 * @param command a command of corresponding type (should be a getter or a setter)
 * @param {string} fieldName tbh will alvays be scriptContent
 * @param setScript a function used to set script within corresponding loop field (for recursion)
 * @param {bool} disabled whether editing is disabled (generally when script is in execution)
 * @returns a JSX component
 */
const LoopEditor = ({ command, fieldName, setScript, disabled }) => {
	const schemeName = useContext(SchemeContext);
	const formData = command[fieldName];
	console.debug('command in loop editor', command, 'field name', fieldName);
	const hooks = useCommandHooks(setScript, schemeName);
	console.debug('setScript in iterate component', setScript);
	return (
		<div style={{ width: '80%', placeSelf: 'center' }}>
			{command[fieldName].length > 0
				? command[fieldName].map((item, i) => {
						//const { ref } = useSortable({ id: i, index: i });
						console.debug('setScript in mapping function in cycle', setScript);
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
			<button
				className={`${buttonStyles.button} ${buttonStyles.menuButton} w-full`}
				onClick={e => hooks.addCommandToScript(formData.length)}
			>
				Добавить
			</button>
		</div>
	);
};
/**
 * an interactive bar (aka form) used to configure a command for signal api
 * @param {number} index a command's place in a script (which is array of commands)
 * @param {Array} script an array of commands (also part of a state variable a few components up in editorTabs), is used to form some helper functions
 * @param setScript setter of script since it belongs to a react state var
 * @param hooks a toolkit for manipulating commands within current script (again, since state var), configured in editorTabs
 * @param {bool} blockEditing whether editing is disabled (generally when script is in execution)
 * @returns a JSX component
 */
const CommandBar = ({
	index,
	script,
	setScript,
	hooks,
	blockEditing = false,
}) => {
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
	//updating function tailored to operate on events (and setAll's specific manner of passing info)
	const updateScript = e => {
		if (e.target.id == 'values') {
			console.debug(
				'e.target.dataset.flagindex in upd',
				e.target.dataset.flagindex
			);
			const newVals = {
				...command.values,
				[Number(e.target.dataset.flagindex)]: Number(e.target.value),
			};
			console.debug('newVals in updateAction', newVals);
			updateCommandField(index, e.target.id, newVals);
		} else
			updateCommandField(
				index,
				e.target.id,
				e.target.id == 'fatal' ? e.target.checked : e.target.value
			);
	};
	//script setter for loops (tailored to accept the same argument types as a normal setScript for recursion reasons)
	const UpdateScriptInCycle = updater => {
		return setScript(prev =>
			prev.map((item, i) => {
				return i == index
					? 'loopContent' in item
						? typeof updater == 'function'
							? { ...item, loopContent: updater(item.loopContent) }
							: { ...item, loopContent: updater }
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
				<DelCommandButton
					delAction={() => deleteCommandFromScript(index)}
					disabled={blockEditing}
				/>
			</div>
			<ActionPicker
				actRef={command.action}
				changeAction={e => changeCommandActionType(index, e.target.value)}
				disabled={blockEditing}
			/>
			{getConfig(command).map((item, ind) =>
				item == 'signal' ? (
					<SelectGroupAndSignal
						key={ind}
						command={command}
						sigtable={sigsByGroup}
						updateAction={updateScript}
						disabled={blockEditing}
					/>
				) : ['targetValue', 'expectedValue'].includes(item) ? (
					<SingleSignalValueInput
						key={ind}
						command={command}
						fieldName={item}
						sigtable={sigsByGroup}
						updateAction={updateScript}
						disabled={blockEditing}
					/>
				) : item == 'scriptPath' ? (
					<ScriptSelection
						key={ind}
						command={command}
						updateAction={updateScript}
						filenames={files}
						disabled={blockEditing}
					/>
				) : item == 'fatal' ? (
					<FatalCheckbox
						command={command}
						updateAction={updateScript}
						fieldName={item}
						key={ind}
						disabled={blockEditing}
					/>
				) : item == 'loopContent' ? (
					<LoopEditor
						command={command}
						fieldName={item}
						setScript={UpdateScriptInCycle}
						key={ind}
						commandIndex={index}
						disabled={blockEditing}
						setErrorIDs={setErrorIDs}
					/>
				) : item == 'board' ? (
					<SetAll
						command={command}
						updateAction={updateScript}
						fieldName={item}
						key={ind}
						disabled={blockEditing}
					/>
				) : (
					<GenInput
						command={command}
						updateAction={updateScript}
						fieldName={item}
						key={ind}
						disabled={blockEditing}
					/>
				)
			)}
		</div>
	);
};
CommandBar.propTypes = {
	index: PropTypes.number,
};
export default CommandBar;
