import React, { useState, useEffect } from 'react';
import styles from '../controlPanel.module.css';
import icons from '../icons';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import Image from 'next/image';
import CloseButton from '@/components/templateComponents/buttons/closeButton';

/**
 * generates CP set selement for panel in test mode only (for the time being)
 * @param {*} param0 has two required fields. First one, specs, is a record with fields "group","signal", "icon" and "default_", corresponding to group name, signal name, icon type ("trigger"/"lamp") and default value the signal must be set to when the panel is loaded. the second field, schemeName, defines backend environment
 */
function Menu({ groups, sigs, setSpecs, specs }) {
	return (
		<div>
			<select
				className={inputStyles.select}
				onChange={e => {
					setSpecs('signal', prev => {
						return { ...prev, parentGroup: e.target.value, name: '' };
					});
				}}
				value={specs.signal.parentGroup}
			>
				<option value={''}>группа</option>
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
						const sig = sigs.filter(item => item.name == e.target.value)[0];
						return {
							...prev,
							name: e.target.value,
							turnedOnStatusName: sig?.turnedOnStatusName,
							turnedOffStatusName: sig?.turnedOffStatusName,
						};
					});
				}}
				value={specs.signal.name}
			>
				<option value={''}>сигнал</option>
				{specs.signal.parentGroup
					? sigs?.map((sig, index) => (
							<option key={index} value={sig.name}>
								{sig.name}
							</option>
						))
					: ''}
			</select>
		</div>
	);
}
function EditCPelem({ data, index, specs, setSpecs, style, remove }) {
	const [menuVisibility, setMenuVisibility] = useState(false);
	console.debug('specs in editelem', specs, 'style', style);
	useEffect(() => {
		if (!('signal' in specs)) setSpecs('signal', { parentGroup: '', name: '' });
	}, [specs]);
	const sigs =
		specs.type == 'setter'
			? data[specs.signal.parentGroup]?.outputs
			: data[specs.signal.parentGroup]?.inputs;
	const groups = Object.keys(data);
	if (!('signal' in specs)) return <p>Загрузка</p>;
	return (
		<div
			className={styles.CPelem}
			onMouseOver={() => setMenuVisibility(true)}
			onMouseOut={() => setMenuVisibility(false)}
			style={{ width: style.width, height: style.height }}
		>
			<CloseButton
				closeAction={remove}
				className={styles.closeButton}
				style={{ width: style.width / 4, height: style.height / 4 }}
			></CloseButton>
			<Image
				src={
					specs.default_
						? icons[specs.type][style.icon].on
						: icons[specs.type][style.icon].off
				}
				className={styles.icon}
				alt="elem's off"
				onClick={
					specs.type == 'setter'
						? e => {
								setSpecs('default_', prev => {
									return Number(!prev);
								});
							}
						: e => {}
				}
			></Image>
			{menuVisibility && (
				<Menu groups={groups} sigs={sigs} setSpecs={setSpecs} specs={specs} />
			)}
		</div>
	);
}

export default EditCPelem;
