'use client';

import PropTypes from 'prop-types';
import styles from '../editor.module.css'; // Updated import path
import React, { useRef, useEffect, useState } from 'react';
//import CommandBar from './commandBar';
import SortableBar from './sortableBar';
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
	schemeId,
}) => {
	const prevData = useRef(formData);
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
	SortableBar.propTypes = {
		id: PropTypes.string,
		index: PropTypes.number,
	};
	if (loading) return <p>Загрузка...</p>;
	return (
		<div className={styles.edit}>
			<DragDropProvider
				onDragStart={() => {
					console.log('drag start');
					prevData.current = formData;
				}}
				onDragOver={event => {
					console.log('drag over');
					console.log(move(formData, event));
					console.log(event);
					setFormData(formData => move(formData, event));
				}}
				onDragEnd={event => {
					console.log('drag end');
					if (event.canceled) {
						setFormData(prevData.current);
						return;
					}
				}}
			>
				<ul>
					{formData.length > 0
						? formData.map((item, i) => (
								<SortableBar
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
								></SortableBar>
							))
						: ''}
				</ul>
			</DragDropProvider>
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
