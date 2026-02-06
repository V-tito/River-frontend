'use client';

import PropTypes from 'prop-types';
import styles from '../editor.module.css'; // Updated import path
import React from 'react';
import CommandBar from './commandBar';

const CommandBarEditor = ({
	formData,
	setFormData,
	isHovered,
	setIsHovered,
	current,
	error,
}) => {
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
								error={error}
								key={i}
								isHovered={isHovered}
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
	scheme: PropTypes.shape({ id: PropTypes.number }),
	current: PropTypes.number,
	error: PropTypes.shape,
	isHovered: PropTypes.number,
	setIsHovered: PropTypes.func,
	formData: PropTypes.array,
	setFormData: PropTypes.func,
};
export default CommandBarEditor;
