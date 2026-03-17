'use client';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import SortableBar from './sortableBar';
import BarEditor from './barEditor';
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
	const [version, setVersion] = useState(0);

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
								setErrorIDs(prev =>
									prev.map(item =>
										item == initialIndex
											? index
											: initialIndex > index
												? (item >= index) & (item < initialIndex)
													? item + 1
													: item
												: (item > initialIndex) & (item <= index)
													? item - 1
													: item
									)
								);
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
								<SortableBar key={i} id={i} index={i}></SortableBar>
							))
						: ''}
				</DragDropProvider>
			</ul>
		</BarEditor>
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
