'use client';
import PropTypes from 'prop-types';
import styles from '../editor.module.css'; // Updated import path
import buttonStyles from '@/styles/buttonStyles.module.css';
import React, { createContext, useEffect, useState } from 'react';
export const BarContext = createContext();
const BarEditor = ({
	formData,
	setFormData,
	isHovered,
	setIsHovered,
	current,
	errorIDs,
	setErrorIDs,
	setError,
	schemeName,
	children,
}) => {
	const [files, setFiles] = useState([]);
	const [sigsByGroup, setSigs] = useState();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchSigs = async () => {
			try {
				console.log(
					'try fetching signals on api',
					`/api/getSignalTables/${schemeName}?sortedSignals=true`
				);
				const response = await fetch(
					`/api/getSignalTables/${schemeName}?sortedSignals=true`
				);
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				const conf = await response.json();
				console.log('sigsbygroup', conf.data);
				console.log('groups', conf.groups);
				const sulResponse = await fetch(
					`/api/getSulSignalTables/${schemeName}`
				);
				const sulConf = await sulResponse.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				const tempGroups = conf.groups;
				console.log('temp groups', conf);
				const tempData = conf.data;
				console.log('data', tempData, 'sul', sulConf, 'groups', tempGroups);
				const tempData2 = tempGroups.reduce((acc, group) => {
					console.log(
						'data w upd, in theory',
						{
							...acc,
							[group.name]: {
								...acc[group.name],
								sulSigs: sulConf.data[group.name],
							},
						},
						tempData
					);
					return {
						...acc,
						[group.name]: {
							...acc[group.name],
							sulSigs: sulConf.data[group.name],
						},
					};
				}, tempData);
				console.log('aggregated data', tempData2);
				setSigs(tempData2);
			} catch (err) {
				if (err instanceof Error) {
					setSigs({});
					setError(err);
				}
			}
		};
		const fetchFiles = async () => {
			try {
				const response = await fetch(`/api/files?folder=${schemeName}`, {
					method: 'GET',
				});
				console.log(response.ok);
				console.log(response);
				if (!response.ok) {
					throw new Error(
						`Ошибка сети ${response.status}: ${response.message ? response.message : ''}`
					);
				}
				const result = await response.json();
				console.log('res', result);
				const fileList = result.files;
				setFiles(fileList);
				console.log('resfiles', fileList);
				console.log('resfilesIsArray', Array.isArray(fileList));
				return;
			} catch (err) {
				setError(err);
				return;
			}
		};
		const fetchAll = async () => {
			if (schemeName !== undefined) {
				await fetchFiles();
			}
			console.log('before fetching sigs');
			await fetchSigs();
			setLoading(false);
		};
		fetchAll();
	}, []);
	if (loading) return <p>Загрузка...</p>;
	return (
		<div className={styles.edit}>
			<BarContext.Provider
				value={{
					formData,
					setFormData,
					current,
					errorIDs,
					setErrorIDs,
					isHovered,
					setIsHovered,
					sigsByGroup,
					files,
				}}
			>
				{children}
			</BarContext.Provider>
			<button
				className={`${buttonStyles.button} ${buttonStyles.menuButton} w-full`}
				onClick={() => {
					setFormData(prevFormData => [...prevFormData, { action: null }]);
				}}
			>
				Добавить
			</button>
		</div>
	);
};
BarEditor.propTypes = {
	initName: PropTypes.string,
	schemeName: PropTypes.string,
	current: PropTypes.number,
	errorIDs: PropTypes.array,
	isHovered: PropTypes.number,
	setIsHovered: PropTypes.func,
	formData: PropTypes.array,
	setFormData: PropTypes.func,
	setError: PropTypes.func,
};

export default BarEditor;
