import React, { useState, useEffect } from 'react';
import styles from './controlPanel.module.css';
import icons from '../icons/icons';
import { setSignalState, getSignalState } from '@/utils/api_wrap/protocol.js';

/**
 * generates CP set selement for panel in test mode only (for the time being)
 * @param {Record<string,Record<string,string>|string>} param0 has two required fields. First one, specs, is a record with fields "group","signal", "icon" and "default_", corresponding to group name, signal name, icon type ("trigger"/"lamp") and default value the signal must be set to when the panel is loaded. the second field, schemeName, defines backend environment
 */
function CPset({ specs, schemeName }) {
	const { signal, icon, default_ } = specs;
	const { parentGroup, name } = signal;
	const [on, setOn] = useState(0);
	const [valid, setValid] = useState(false);
	useEffect(() => {
		const setDef = async () => {
			if (default_)
				if (!(on == default_)) {
					await setSignalState(schemeName, parentGroup, name, default_);
					setOn(default_);
					setValid(true);
				}
		};
		if (!valid) setDef();
	}, [valid]);
	return (
		<button
			className={styles.element}
			onClick={e => setSignalState(schemeName, parentGroup, name, !on)}
			disabled={!valid}
		>
			<img src={icons[icon][on ? 'on' : 'off']} className={styles.icon}></img>
		</button>
	);
}

export default CPset;
