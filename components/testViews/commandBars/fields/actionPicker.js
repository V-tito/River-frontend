import React from 'react';
import { CommandAction } from '@/utils/hooks/command/command';
//styles
import inputStyles from '@/styles/inputStyles.module.css';
import styles from '../commandBar.module.css';

export default function ActionPicker({ actRef, changeAction, disabled }) {
	return (
		<select
			id="action"
			value={actRef}
			className={inputStyles.select}
			onChange={changeAction}
			disabled={disabled}
		>
			{Object.values(CommandAction)
				.filter(val => val != CommandAction.presetAll)
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
}
