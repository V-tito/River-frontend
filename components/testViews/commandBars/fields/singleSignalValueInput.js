//react
import React, { useContext } from 'react';
//styles
import inputStyles from '@/styles/inputStyles.module.css';
import styles from '../commandBar.module.css';
//hooks & contexts
import { CommandBarHelpers } from '@/utils/hooks/command/commandBarHelpers';
import { BarContext } from '../barEditor';

const { translateFields } = CommandBarHelpers;
const CheckIfSigsAreNotUndef = (command, sigsByGroup) => {
	if (![undefined, ''].includes(command.group) & (sigsByGroup != undefined))
		if (sigsByGroup[command.group] != undefined) return true;
	return false;
};
/**
 * used for setting a value of a single boolean signal
 * @param command a command of corresponding type (should be a getter or a setter)
 * @param {string} fieldName tbh would always be targetValue or expectedValue if used right
 * @param updateAction a function used on component value change (is defined in commandBar and may change depending on changes in execution logic)
 * @param {bool} disabled whether editing is disabled (generally when script is in execution)
 * @returns a JSX component
 */
function ValueRadio({ command, fieldName, updateAction, disabled }) {
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
}

/**
 * used for setting a value of a single signal
 * @param command a command of corresponding type (should be a getter or a setter)
 * @param {string} fieldName tbh would always be targetValue or expectedValue if used right
 * @param updateAction a function used on component value change (is defined in commandBar and may change depending on changes in execution logic)
 * @param {bool} disabled whether editing is disabled (generally when script is in execution)
 * @returns a JSX component
 */
export default function SingleSignalValueInput({
	command,
	fieldName,
	updateAction,
	disabled,
}) {
	const { sigsByGroup } = useContext(BarContext);
	const isRadio =
		command.signalSubtype == 'SulSignal'
			? !sigsByGroup[command.group].sulSigs.find(
					item => item.name == command.signal
				).bool
				? false
				: true
			: true;

	if (CheckIfSigsAreNotUndef(command, sigsByGroup))
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
}
