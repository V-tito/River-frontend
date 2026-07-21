import CommandBar from './commandBar';
import { useSortable } from '@dnd-kit/react/sortable';
import React from 'react';
const SortableBar = ({ id, index, blockEditing }) => {
	const { ref } = useSortable({ id, index });
	console.log('id in sortable', id);
	console.log('index in sortable', index);
	return (
		<li ref={ref}>
			<CommandBar index={index} blockEditing={blockEditing}></CommandBar>
		</li>
	);
};
export default SortableBar;
