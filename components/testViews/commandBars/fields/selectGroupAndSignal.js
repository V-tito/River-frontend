import React, { useContext } from 'react';
import styles from '../commandBar.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
//hooks,contexts,helpers
import { CommandBarHelpers } from '@/utils/hooks/command/commandBarHelpers';
import { BarContext } from '../barEditor';

const { isSetter } = CommandBarHelpers;
const CheckIfSigsAreNotUndef = (command, sigsByGroup) => {
	if (![undefined, ''].includes(command.group) & (sigsByGroup != undefined))
		if (sigsByGroup[command.group] != undefined) return true;
	return false;
};

/**
 * used for selecting a group and a signal from said group (for getters and setters)
 * @param command a command of corresponding type (should be a getter or a setter)
 * @param {string} fieldName not really needed, only used for all field components to have the same interface when possible
 * @param updateAction a function used on component value change (is defined in commandBar and may change depending on changes in execution logic)
 * @param {bool} disabled whether editing is disabled (generally when script is in execution)
 * @returns a JSX component
 */
export default function SelectGroupAndSignal({
	command,
	fieldName,
	updateAction,
	disabled,
}) {
	const { sigsByGroup } = useContext(BarContext);
	const listOfSignals = CheckIfSigsAreNotUndef(command, sigsByGroup)
		? isSetter(command)
			? sigsByGroup[command.group].outputs
			: [
					//...sigsByGroup[command.group].outputs,
					...sigsByGroup[command.group].inputs,
					...sigsByGroup[command.group].sulSigs,
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
}
