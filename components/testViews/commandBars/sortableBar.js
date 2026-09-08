import CommandBar from './commandBar';
import { useSortable } from '@dnd-kit/react/sortable';
import React from 'react';
const SortableBar = ({ script, setScript, id, index, blockEditing, hooks }) => {
	const { ref } = useSortable({ id, index });
	return (
		<li ref={ref}>
			<CommandBar
				script={script}
				setScript={setScript}
				index={index}
				blockEditing={blockEditing}
				hooks={hooks}
			></CommandBar>
		</li>
	);
};
export default SortableBar;
