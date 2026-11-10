import React, { useState, useEffect } from 'react';
import styles from '../controlPanel.module.css';
import icons from '../icons';
import { setSignalState } from '@/utils/api_wrap/protocol.js';
import StyledIcon from './styledIcon';

/**
 * generates CP set selement for panel in test mode only (for the time being)
 *
 */
function CPset({ specs, envName, haveInit, setHaveInit, schemeOn, writeLog }) {
	const { signal, icon, default_, valid, position } = specs;
	const { parentGroup, name } = signal;
	const [on, setOn] = useState(-1);
	const [disabled, setDisabled] = useState(true);
	const icon_ = icons.setter[icon];
	const logSet = val =>
		writeLog(
			'Панель управления: значение сигнала ' +
				name +
				' установлено на ' +
				Number(val),
			'setter'
		);
	const logErr = err => {
		writeLog(
			'Панель управления: ' + err.message ?? 'неизвестная ошибка',
			'error'
		);
	};

	useEffect(() => {
		const setDef = async () => {
			console.debug('schemeOn in setter', schemeOn, 'default_', default_);
			if (default_ != undefined && default_ != null)
				if (!(on == default_)) {
					try {
						await setSignalState(envName, parentGroup, name, default_);
						console.debug('have set state in cp');
						console.debug('setting on');
						logSet(default_);
						setOn(default_);
					} catch (err) {
						console.debug('caught error', err);
						logErr(err);
					}
				}
			setHaveInit(prev => {
				return { ...prev, [name]: true };
			});
			setDisabled(false);
		};
		const init_ = haveInit[name];
		if (valid) {
			if (!init_ && schemeOn) setDef();
		} else setDisabled(true);
	}, [signal, schemeOn, haveInit]);
	return (
		<button
			onClick={async e => {
				try {
					await setSignalState(envName, parentGroup, name, !on);
					logSet(!on);
					setOn(!on);
					console.debug('sent set state');
				} catch (err) {
					console.debug('caught error');
					logErr(err);
					setOn(-1);
				}
			}}
			disabled={disabled}
		>
			<StyledIcon
				icon_={icon_}
				on={on}
				error={on == -1}
				signal={signal}
				position={position}
				disabled={disabled}
			/>
		</button>
	);
}

export default CPset;
