import { CommandBarHelpers } from '@/utils/hooks/command/commandBarHelpers';
import styles from '../commandBar.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
const { translateFields } = CommandBarHelpers;
export default function GenInput({
	command,
	fieldName,
	updateAction,
	disabled,
}) {
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
}
