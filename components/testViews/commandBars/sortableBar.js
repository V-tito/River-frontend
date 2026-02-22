import CommandBar from './commandBar';
import { useSortable } from '@dnd-kit/react/sortable';
import React from 'react';
const SortableBar = ({
	id,
	index,
	script,
	setScript,
	current,
	errorIDs,
	isHovered,
	setIsHovered,
	sigsByGroup,
}) => {
	const { ref } = useSortable({ id, index });
	console.log('fd in sortable', script);
	console.log('id in sortable', id);
	console.log('index in sortable', index);
	return (
		<li ref={ref}>
			<CommandBar
				script={script}
				setScript={setScript}
				index={index}
				current={current}
				errorIDs={errorIDs}
				isHovered={isHovered}
				setIsHovered={setIsHovered}
				sigsByGroup={sigsByGroup}
			></CommandBar>
		</li>
	);
};
export default SortableBar;
