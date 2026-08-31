export default function FatalCheckbox({
	command,
	fieldName,
	updateAction,
	disabled,
}) {
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
}
