import React, { useState, useEffect } from 'react';
import styles from '../controlPanel.module.css';
import icons from '../icons/icons';
import { setSignalState, getSignalState } from '@/utils/api_wrap/protocol.js';
import triggerOn from '../icons/triggerOn.jpg';
import triggerOff from '../icons/triggerOff.jpg';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import Image from 'next/image';
import CloseButton from '@/components/templateComponents/buttons/closeButton';
function SetterWrap({ icon, setSpecs, specs }) {
	return (
		<Image
			src={specs.default_ ? icon.on : icon.off}
			className={styles.icon}
			alt="trigger"
			onClick={e => {
				setSpecs('default_', prev => {
					console.debug('entered defset, !prev is', !prev, 'prev is', prev);
					return Number(!prev);
				});
			}}
		></Image>
	);
}
/**
 * generates CP set selement for panel in test mode only (for the time being)
 * @param {*} param0 has two required fields. First one, specs, is a record with fields "group","signal", "icon" and "default_", corresponding to group name, signal name, icon type ("trigger"/"lamp") and default value the signal must be set to when the panel is loaded. the second field, schemeName, defines backend environment
 */
function EditCPelem({ data, index, specs, setSpecs, remove }) {
	useEffect(() => {
		if (!('signal' in specs))
			setSpecs('signal', { parentGroup: null, name: null });
	}, [specs]);
	const sigs =
		specs.type == 'setter'
			? data[specs.signal.parentGroup]?.outputs.map(item => item.name)
			: data[specs.signal.parentGroup]?.inputs.map(item => item.name);
	const groups = Object.keys(data);
	if (!('signal' in specs)) return <p>Загрузка</p>;
	return (
		<div className={styles.CPset}>
			<CloseButton
				closeAction={remove}
				className={styles.closeButton}
			></CloseButton>
			{specs.type == 'setter' ? (
				<SetterWrap
					icon={icons.setter[specs.icon]}
					specs={specs}
					setSpecs={setSpecs}
				/>
			) : (
				<Image
					src={icons.getter[specs.icon].off}
					className={styles.icon}
					alt="lamp's off"
				></Image>
			)}
			<select
				className={inputStyles.select}
				onChange={e => {
					setSpecs('signal', prev => {
						return { ...prev, parentGroup: e.target.value };
					});
				}}
				value={specs.signal.parentGroup}
			>
				<option value={null}>группа</option>
				{groups.map((group, index) => (
					<option key={index} value={group}>
						{group}
					</option>
				))}
			</select>
			<select
				className={inputStyles.select}
				onChange={e => {
					setSpecs('signal', prev => {
						return { ...prev, name: e.target.value };
					});
				}}
				value={specs.signal.name}
			>
				<option value={null}>сигнал</option>
				{specs.signal.parentGroup
					? sigs?.map((sig, index) => (
							<option key={index} value={sig}>
								{sig}
							</option>
						))
					: ''}
			</select>
		</div>
	);
}

export default EditCPelem;
