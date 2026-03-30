'use client';

import PropTypes from 'prop-types';
import styles from '../editor.module.css'; // Updated import path
import React from 'react';
import BarEditor from './barEditor';
import CommandBar from './commandBar';

const CommandBarEditor = ({
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
	return (
		<BarEditor
			formData={formData}
			setFormData={setFormData}
			isHovered={isHovered}
			setIsHovered={setIsHovered}
			current={current}
			errorIDs={errorIDs}
			setErrorIDs={setErrorIDs}
			setError={setError}
			schemeName={schemeName}
		>
			{formData.length > 0
				? formData.map((item, i) => (
						<div key={i} className="flex flex-col w-full">
							<button
								className={styles.button}
								onClick={() => {
									setFormData(prevFormData =>
										prevFormData.toSpliced(i, 0, { action: null })
									);
									setErrorIDs(prevErrorIDs =>
										prevErrorIDs.map(item => (item >= i ? item++ : item))
									);
								}}
							>
								Добавить
							</button>
							<CommandBar index={i}></CommandBar>
						</div>
					))
				: ''}
		</BarEditor>
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
