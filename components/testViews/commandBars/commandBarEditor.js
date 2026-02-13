'use client';

import PropTypes from 'prop-types';
import styles from '../editor.module.css'; // Updated import path
import React, { useEffect, useState } from 'react';
import CommandBar from './commandBar';

const CommandBarEditor = ({
	formData,
	setFormData,
	isHovered,
	setIsHovered,
	current,
	errorIDs,
	setError,
	schemeId,
}) => {
	const [sigsByGroup, setSigs] = useState();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchSigs = async () => {
			try {
				const response = await fetch(
					`/api/getSignalTables/${schemeId}?sortedSignals=true&namesOnly=true`
				);
				const conf = await response.json();
				if (!response.ok) {
					throw new Error(`Ошибка сети ${response.status}`);
				}
				setSigs(conf.data);
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
						<div
							key={i}
							onMouseEnter={() => {
								setIsHovered(i);
								console.log('hover', i);
							}}
							onMouseLeave={() => setIsHovered(null)}
						>
							<CommandBar
								script={formData}
								setScript={setFormData}
								index={i}
								current={current}
								errorIDs={errorIDs}
								key={i}
								isHovered={isHovered}
								sigsByGroup={sigsByGroup}
							></CommandBar>
						</div>
					))
				: ''}
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
CommandBarEditor.propTypes = {
	initName: PropTypes.string,
	schemeId: PropTypes.number,
	current: PropTypes.number,
	errorIDs: PropTypes.array,
	isHovered: PropTypes.number,
	setIsHovered: PropTypes.func,
	formData: PropTypes.array,
	setFormData: PropTypes.func,
	setError: PropTypes.func,
};
export default CommandBarEditor;
