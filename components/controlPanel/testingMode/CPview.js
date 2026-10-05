import React, { useEffect, useState, useCallback } from 'react';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import CPgrid from './CPgrid';
import ChooseCP from '../chooseCP';
import CPerrors from './CPerrors';
import { toggleScheme } from '@/utils/api_wrap/protocol';
import { useGlobal } from '@/app/GlobalState';
import { usePersistentData } from '@/utils/hooks/usePersistentData';
import { useBeforeUnload } from 'react-use';
import { useRouter } from 'next/navigation';

//func for validating current cp
function CPview({ schemeName, className = '' }) {
	const { currentWS, schemeOn, setSchemeOn } = useGlobal();
	const [currentCP, setCurrentCP] = useState(null);
	const [currentContent, setCurrentContent] = useState([]);
	const [errors, setErrors] = useState([]);
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const response = await fetch(
					`/api/files/gen?folder=${schemeName}/CPs`,
					{
						method: 'GET',
					}
				);
				if (!response.ok) {
					throw new Error(
						`Ошибка сети ${response.status}: ${response.message ? response.message : ''}`
					);
				}
				const result = await response.json();
				const fileList = result.files;
				console.debug('files in chooseCP', fileList);
				setFiles(fileList);
				setLoading(false);
			} catch (err) {
				setErrors(prev => prev.push(err));
			}
		};
		if (schemeName !== undefined) {
			fetchFiles();
		}
	}, []);

	useEffect(() => {
		const init = async () => {
			setLoading(true);
			try {
				console.debug(
					'started polling content on api',
					`/api/files/gen?folder=${schemeName}/CPs&filename=${currentCP}`
				);
				const response = await fetch(
					`/api/files/gen?folder=${schemeName}/CPs&filename=${currentCP}`,
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
			} catch (err) {
				setErrors(prev => prev.push(err));
			}
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
				onChange={e => setCurrentCP(e.target.value)}
				cps={files}
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
