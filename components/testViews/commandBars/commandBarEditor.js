'use client';

import PropTypes from 'prop-types';
import styles from '../editor.module.css'; // Updated import path
import React, { useRef, useEffect, useState } from 'react';
//import CommandBar from './commandBar';
import CommandBar from './commandBar';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
//
function getID() {
	const id = `${Date.now()}-${Math.random().toString(12).substring(2, 9)}`;
	console.log('id', id);
	return id;
}
const CommandBarEditor = ({
	formData,
	setFormData,
	isHovered,
	setIsHovered,
	current,
	errorIDs,
	setError,
	schemeName,
}) => {
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
					setError(err);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchSigs();
	}, []);
	if (loading) return <p>Загрузка...</p>;
	return (
		<div className={styles.edit}>
			{formData.length > 0
				? formData.map((item, i) => (
						<CommandBar
							key={i}
							id={getID()}
							index={i}
							script={formData}
							setScript={setFormData}
							current={current}
							errorIDs={errorIDs}
							isHovered={isHovered}
							setIsHovered={setIsHovered}
							sigsByGroup={sigsByGroup}
						></CommandBar>
					))
				: ''}
			<button
				className={styles.button}
				onClick={() => {
					setFormData(prevFormData => [...prevFormData, { action: null }]);
					console.log('fd', formData);
				}}
			>
				Добавить
			</button>
		</div>
	);
};
CommandBarEditor.propTypes = {
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

export default CommandBarEditor;
