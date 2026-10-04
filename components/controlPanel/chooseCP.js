import React, { useEffect, useState } from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import UploadFileModal from '@/components/fileManagement/uploadFileModal';
export default function ChooseCP({ schemeName, currentCP, onChange, cps }) {
	return (
		<div className="flex flex-row">
			<UploadFileModal folder={`${schemeName}/CPs`} />
			<select
				className={inputStyles.select}
				onChange={onChange}
				value={currentCP}
			>
				<option value={null}>Выбрать панель</option>
				{cps.map((cp, index) => (
					<option key={index} value={cp}>
						{cp}
					</option>
				))}
			</select>
		</div>
	);
}
