import styles from '../controlPanel.module.css';
import icons from '../icons';
import Image from 'next/image';
/**
 * generates CP get selement for panel in test mode only (for the time being)
 * @param {*} param0 has two fields. the first is specs, a record with fields "signal" and "icon", corresponding to signal (minimal signal interface, see:hooks) and icon type ("trigger"/"lamp"). The second is on, a state variable (or a field in a state variable) keeping the state of corresponding signal, fetched from backend (data gathering lifted up for performance)
 */
function CPget({ specs, onTable, schemeOn }) {
	console.debug('mounted getter with specs', specs, 'onTable', onTable);
	const { signal, icon, valid } = specs;
	const { parentGroup, name, turnedOnStatusName, turnedOffStatusName } = signal;
	let on = -1,
		error = false;
	const disabled = !valid || !schemeOn;
	console.debug('getter', specs, 'isValid', valid);
	if (valid) {
		console.debug('name', name, 'onTable', onTable);
		on = onTable[name]?.on;
		error = onTable[name]?.valid;
	}
	const icon_ = icons.getter[icon];
	return (
		<div className={styles.CPget}>
			<Image
				src={
					disabled
						? icon_.disabled
						: (on == undefined) | error
							? icon_.error
							: on > 0
								? icon_.on
								: icon_.off
				}
				className={styles.icon}
				alt={
					disabled
						? 'Нет данных'
						: (on == undefined) | error
							? 'Ошибка получения данных'
							: on > 0
								? (turnedOnStatusName ?? 'Вкл')
								: (turnedOffStatusName ?? 'Выкл')
				}
			></Image>
			<span className={styles.label}>{name}</span>
		</div>
	);
}

export default CPget;
