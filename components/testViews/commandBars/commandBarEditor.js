'use client';

import PropTypes from 'prop-types';
import styles from '../editor.module.css'; // Updated import path
import React, { useRef, useEffect, useState } from 'react';
import CommandBar from './commandBar';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useSortable } from '@dnd-kit/react/sortable';
function getID() {
	return `${Date.now()}-${Math.random().toString(12).substring(2, 9)}`;
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
	function SortableBar({ id, index }) {
		const { ref } = useSortable({ id, index });

		return (
			<CommandBar
				ref={ref}
				script={formData}
				setScript={setFormData}
				index={index}
				current={current}
				errorIDs={errorIDs}
				isHovered={isHovered}
				sigsByGroup={sigsByGroup}
			></CommandBar>
		);
	}
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
		<DragDropProvider
			onDragStart={() => {
				prevData.current = formData;
			}}
			onDragOver={event => {
				setFormData(formData => move(formData, event));
			}}
			onDragEnd={event => {
				if (event.canceled) {
					setFormData(prevData.current);
					return;
				}
			}}
		>
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
								{SortableBar(getID(), i)}
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
		</DragDropProvider>
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
