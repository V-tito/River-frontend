import React from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';

export default function ChooseCP({ currentConfName, onChange, cps }) {
	return (
		<select
			className={inputStyles.select}
			onChange={onChange}
			value={currentConfName}
		>
			<option value={null}>Выбрать панель</option>
			{cps.map((cp, index) => (
				<option key={index} value={cp}>
					{cp}
				</option>
			))}
		</select>
	);
}
