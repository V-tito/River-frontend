import React, { useState, useEffect } from 'react';
import styles from '../controlPanel.module.css';
import icons from '../icons';

import { setSignalState, getSignalState } from '@/utils/api_wrap/protocol.js';
import Image from 'next/image';

/**
 * generates CP set selement for panel in test mode only (for the time being)
 * @param {Record<string,Record<string,string>|string>} param0 has two required fields. First one, specs, is a record with fields "group","signal", "icon" and "default_", corresponding to group name, signal name, icon type ("trigger"/"lamp") and default value the signal must be set to when the panel is loaded. the second field, schemeName, defines backend environment
 */
function CPset({ specs, schemeName, haveInit, setHaveInit, schemeOn }) {
	const { signal, icon, default_, valid } = specs;
	const { parentGroup, name, turnedOnStatusName, turnedOffStatusName } = signal;
	const [on, setOn] = useState(-1);
	const [disabled, setDisabled] = useState(true);
	const icon_ = icons.setter[icon];
	useEffect(() => {
		const setDef = async () => {
			console.debug('schemeOn in setter', schemeOn, 'default_', default_);
			if (default_ != undefined && default_ != null)
				if (!(on == default_)) {
					try {
						await setSignalState(schemeName, parentGroup, name, default_);
						console.debug('have set state in cp');
						console.debug('setting on');
						setOn(default_);
					} catch (err) {
						console.debug('caught error', err);
						const now = new Date().toLocaleTimeString();
					}
				}
			setHaveInit(prev => {
				return { ...prev, [name]: true };
			});
			setDisabled(false);
		};
		console.debug('setting defs', haveInit);
		console.debug('haveInit', haveInit);
		const init_ = haveInit[name];
		console.debug('haveInit', haveInit);
		if (valid) {
			if (!init_ && schemeOn) setDef();
		} else setDisabled(true);
	}, [signal, schemeOn, haveInit]);
	return (
		<button
			className={styles.CPset}
			onClick={async e => {
				try {
					await setSignalState(schemeName, parentGroup, name, !on);
					setOn(!on);
					console.debug('sent set state');
				} catch (err) {
					console.debug('caught error');
					const now = new Date().toLocaleTimeString();
				}
			}}
			disabled={disabled}
		>
			<Image
				src={
					disabled
						? icon_.disabled
						: on === -1
							? icon_.error
							: on
								? icon_.on
								: icon_.off
				}
				className={styles.icon}
				width={56}
				height={56}
				alt={on ? (turnedOnStatusName ?? '') : (turnedOffStatusName ?? '')}
			/>
			<span className={styles.label}>{name}</span>
		</button>
	);
}

export default CPset;
