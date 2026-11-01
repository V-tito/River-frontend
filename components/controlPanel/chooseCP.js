import React, { useEffect, useState } from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import OpenLocalFileModal from '../modals/openLocalFileModal';
import { postCP } from '@/utils/api_wrap/fileAPI';
export default function ChooseCP({
	schemeName,
	currentConfName,
	onChange,
	cps,
	initCPs,
}) {
	const [uploadError, setUploadError] = useState(null);
	const handleFileUpload = async (e, file) => {
		e.preventDefault();
		try {
			await postCP(schemeName, file.name, file);
			await initCPs();
		} catch (err) {
			setUploadError(err);
		}
	};
	return (
		<div className="flex flex-row">
			<OpenLocalFileModal
				uploadAction={handleFileUpload}
				uploadError={uploadError}
				label="Добавить панель управления"
			/>
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
		</div>
	);
}
