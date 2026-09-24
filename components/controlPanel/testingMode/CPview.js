import React, { useEffect, useState, useCallback } from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import CPgrid from './CPgrid';
import ChooseCP from './chooseCP';
import CPerrors from './CPerrors';
import { toggleScheme } from '@/utils/api_wrap/protocol';
import { useGlobal } from '@/app/GlobalState';
import { usePersistentData } from '@/utils/hooks/usePersistentData';
import { useBeforeUnload } from 'react-use';
import { useRouter } from 'next/navigation';

//func for validating current cp
function CPview({ schemeName, className = '' }) {
	const { defaultScheme, schemeOn, setSchemeOn } = useGlobal();
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
	const { saveData, loadData, clearData } = usePersistentData({
		storageKey: 'current-control-panel',
		storageType: 'session',
	});
	const saveCPToSessionStorage = cp => {
		saveData({
			currentCP: cp,
		});
	};
	useEffect(() => {
		loadCPFromSessionStorage();
	}, []);

	const loadCPFromSessionStorage = useCallback(() => {
		const data = loadData();
		if (data) {
			const { currentCP } = data;
			setCurrentCP(currentCP);
		}
	}, []);
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			saveCPToSessionStorage(currentCP);
		}, 500); // Debounce 500ms

		return () => clearTimeout(timeoutId);
	}, [saveCPToSessionStorage, currentCP]);
	return (
		<div className={className}>
			<label className={headerStyles.modalHeader}>Панель управления</label>
			<ChooseCP
				schemeName={schemeName}
				currentCP={currentCP}
				setCurrentCP={setCurrentCP}
			></ChooseCP>
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
