import React, { useState, useEffect } from 'react';
import styles from '../controlPanel.module.css';
import icons from '../icons/icons';
import { setSignalState, getSignalState } from '@/utils/api_wrap/protocol.js';
import triggerOn from '../icons/triggerOn.jpg';
import triggerOff from '../icons/triggerOff.jpg';
import Image from 'next/image';

/**
 * generates CP set selement for panel in test mode only (for the time being)
 * @param {Record<string,Record<string,string>|string>} param0 has two required fields. First one, specs, is a record with fields "group","signal", "icon" and "default_", corresponding to group name, signal name, icon type ("trigger"/"lamp") and default value the signal must be set to when the panel is loaded. the second field, schemeName, defines backend environment
 */
function CPset({ specs, schemeName, setErrors }) {
	const { signal, icon, default_ } = specs;
	const { parentGroup, name } = signal;
	const [on, setOn] = useState(-1);
	const [valid, setValid] = useState(false);
	useEffect(() => {
		const setDef = async () => {
			if ((default_ != undefined) & (default_ != null))
				if (!(on == default_)) {
					try {
						const response = await setSignalState(
							schemeName,
							parentGroup,
							name,
							default_
						);
						if (!response.ok) throw new Error(response.message);
						setOn(default_);
					} catch (err) {
						console.debug('caught error');
						const now = new Date().toLocaleTimeString();
						setErrors(prev => {
							console.debug('prev errors', prev);
							return [
								...prev,
								`${now}: ${'message' in err ? err.message : 'неизвестная ошибка'}`,
							];
						});
					}
				}
			setValid(true);
		};
		console.debug('setting defs');
		console.debug('invalid', !valid);
		if (!valid) setDef();
	}, []);
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
					setErrors(prev => [
						...prev,
						`${now}: ${'message' in err ? err.message : 'неизвестная ошибка'}`,
					]);
				}
			}}
			disabled={!valid}
		>
			<Image
				src={on ? triggerOn : triggerOff}
				className={styles.icon}
				width={56}
				height={56}
				alt={on ? "trigger's on" : "trigger's off"}
			/>
			<span className={styles.label}>{name}</span>
		</button>
	);
}

export default CPset;
