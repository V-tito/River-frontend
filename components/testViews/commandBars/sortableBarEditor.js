'use client';

import PropTypes from 'prop-types';
import styles from '../editor.module.css'; // Updated import path
import React, { useEffect, useState } from 'react';
import SortableBar from './sortableBar';
import { DragDropProvider } from '@dnd-kit/react';

const SortableBarEditor = ({
	formData,
	setFormData,
	isHovered,
	setIsHovered,
	current,
	errorIDs,
	setErrorIDs,
	setError,
	schemeName,
}) => {
	const [sigsByGroup, setSigs] = useState();
	const [loading, setLoading] = useState(true);
	const [version, setVersion] = useState(0);
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
			} finally {
				setLoading(false);
			}
		};
		fetchSigs();
	}, []);
	if (loading) return <p>Загрузка...</p>;
	return (
		<div className={styles.edit}>
			<ul>
				<DragDropProvider
					key={version}
					onDragEnd={event => {
						if (event.canceled) return;

						const { source } = event.operation;

						const { initialIndex, index } = source;

						if (initialIndex !== index) {
							setFormData(items => {
								console.log('init fd', items);
								const newData = [...items];
								const [removed] = newData.splice(initialIndex, 1);
								newData.splice(index, 0, removed);
								console.log('new fd', newData);
								return newData;
							});
							setVersion(prev => prev + 1);
						}
						//
					}}
				>
					{formData.length > 0
						? formData.map((item, i) => (
								<SortableBar
									key={i}
									id={i}
									index={i}
									script={formData}
									setScript={setFormData}
									current={current}
									errorIDs={errorIDs}
									isHovered={isHovered}
									setIsHovered={setIsHovered}
									sigsByGroup={sigsByGroup}
								></SortableBar>
							))
						: ''}
				</DragDropProvider>
			</ul>

			<button
				className={styles.button}
				onClick={() => {
					setFormData(prevFormData => [...prevFormData, { action: null }]);
				}}
			>
				Добавить
			</button>
		</div>
	);
};
SortableBarEditor.propTypes = {
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

export default SortableBarEditor;
