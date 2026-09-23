import React, { useEffect, useState } from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import CPgrid from './CPgrid';
import ChooseCP from './chooseCP';
import CPerrors from './CPerrors';
//func for validating current cp
function CPview({ schemeName, className = '' }) {
	const [currentCP, setCurrentCP] = useState(null);
	const [currentContent, setCurrentContent] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState([]);
	useEffect(() => {
		const init = async () => {
			setLoading(true);
			console.debug(
				'started polling content on api',
				`/api/files?folder=${schemeName}/CPs&filename=${currentCP}`
			);
			const response = await fetch(
				`/api/files?folder=${schemeName}/CPs&filename=${currentCP}`,
				{
					method: 'GET',
				}
			);
			const contentFile = await response.json();
			console.debug('polled content', contentFile);
			if (contentFile.type != 'file') {
				throw new Error(`${schemeName}/CPs/${currentCP} не является файлом`);
			}
			const content = JSON.parse(contentFile.content);
			console.debug('parsedContent', content);
			setCurrentContent(content);
			setLoading(false);
		};
		if ((currentCP != null) & (currentCP != undefined)) init();
	}, [currentCP]);
	useEffect(() => {
		console.debug('loading panel', loading);
	}, [loading]);
	return (
		<div className={className}>
			<label className={headerStyles.modalHeader}>Панель управления</label>
			<ChooseCP schemeName={schemeName} setCurrentCP={setCurrentCP}></ChooseCP>
			<CPgrid
				elems={currentContent}
				schemeName={schemeName}
				loadingConfig={loading}
				setErrors={setErrors}
			></CPgrid>
			<CPerrors errorList={errors} />
		</div>
	);
}
export default CPview;
