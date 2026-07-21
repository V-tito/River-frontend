'use client';

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SortableBar from './sortableBar';
import BarEditor from './barEditor';
import { DragDropProvider } from '@dnd-kit/react';

const SortableBarEditor = ({
	formData,
	setFormData,
	setErrorIDs,
	setError,
	blockEditing = false,
}) => {
	console.info('mounted SortableBarEditor component');
	const [version, setVersion] = useState(0);
	return (
		<BarEditor
			formData={formData}
			setFormData={setFormData}
			setError={setError}
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
								const newData = [...items];
								const [removed] = newData.splice(initialIndex, 1);
								newData.splice(index, 0, removed);
								return newData;
							});
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
									blockEditing={blockEditing}
								></SortableBar>
							))
						: ''}
				</DragDropProvider>
			</ul>
		</BarEditor>
	);
};
SortableBarEditor.propTypes = {
	errorIDs: PropTypes.array,
	formData: PropTypes.array,
	setFormData: PropTypes.func,
	setError: PropTypes.func,
};

export default SortableBarEditor;
