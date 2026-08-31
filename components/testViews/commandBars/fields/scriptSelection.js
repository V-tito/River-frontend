import inputStyles from '@/styles/inputStyles.module.css';
import styles from '../commandBar.module.css';
export default function ScriptSelection({
	command,
	updateAction,
	filenames,
	disabled,
}) {
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
}
