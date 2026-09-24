import styles from '../controlPanel.module.css';
import icons from '../icons/icons';
import lampOn from '../icons/lampOn.png';
import lampOff from '../icons/lampOff.png';
import lampError from '../icons/lampError.png';
import Image from 'next/image';
/**
 * generates CP get selement for panel in test mode only (for the time being)
 * @param {*} param0 has two fields. the first is specs, a record with fields "signal" and "icon", corresponding to signal (minimal signal interface, see:hooks) and icon type ("trigger"/"lamp"). The second is on, a state variable (or a field in a state variable) keeping the state of corresponding signal, fetched from backend (data gathering lifted up for performance)
 */
function CPget({ specs, onTable }) {
	const { signal, icon } = specs;
	const { parentGroup, name } = signal;
	const on = name in onTable ? onTable[name].on : -1;
	console.log('icon addr', lampOn);
	return (
		<div className={styles.CPget}>
			<Image
				src={
					(on == -1) | (on == undefined) ? lampError : on > 0 ? lampOn : lampOff
				}
				className={styles.icon}
				alt={
					(on == -1) | (on == undefined)
						? 'error fetching signal'
						: on > 0
							? "lamp's on"
							: "lamp's off"
				}
			></Image>
			<span className={styles.label}>{name}</span>
		</div>
	);
}

export default CPget;
