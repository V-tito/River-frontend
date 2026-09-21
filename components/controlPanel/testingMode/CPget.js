import styles from './controlPanel.module.css';
import icons from '../icons/icons';
/**
 * generates CP get selement for panel in test mode only (for the time being)
 * @param {*} param0 has two fields. the first is specs, a record with fields "signal" and "icon", corresponding to signal (minimal signal interface, see:hooks) and icon type ("trigger"/"lamp"). The second is on, a state variable (or a field in a state variable) keeping the state of corresponding signal, fetched from backend (data gathering lifted up for performance)
 */
function CPget({ specs, onTable }) {
	const { signal, icon } = specs;
	const { parentGroup, name } = signal;
	const on = name in onTable ? onTable[name].on : -1;
	return (
		<div className={styles.element}>
			<img
				src={icons[icon][on == -1 ? 'error' : on > 0 ? 'on' : 'off']}
				className={styles.icon}
			></img>
			<span className={styles.label}>
				Сигнал {name} группы {parentGroup}
			</span>
		</div>
	);
}

export default CPget;
