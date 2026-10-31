import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import EditCPelem from './editCPelem';
import styles from '../controlPanel.module.css';
import { useSortable } from '@dnd-kit/react/sortable';
import { closestCenter } from '@dnd-kit/collision';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import { Feedback } from '@dnd-kit/dom';

function SortableElem({ index, setSpecs, item, data, groups, remove }) {
	const { ref } = useSortable({ id: item.id, index: index, group: 'panel' });
	return (
		<li ref={ref} className={styles.li}>
			<EditCPelem
				index={index}
				specs={item}
				setSpecs={setSpecs}
				groups={groups}
				data={data}
				remove={remove}
			/>
		</li>
	);
}
function DraggableElem({ index, setSpecs, item, data, groups, remove }) {
	const { ref, isDragging } = useDraggable({
		id: item.id,
		data: { index: index, group: 'panel' },
		plugins: [
			Feedback.configure({
				feedback: 'move',
				dropAnimation: null,
			}),
		],
	});
	return (
		<div
			style={{
				position: 'relative',
				top: isDragging ? undefined : item?.position?.y,
				left: isDragging ? undefined : item?.position?.x,
			}}
			ref={ref}
		>
			<EditCPelem
				index={index}
				specs={item}
				setSpecs={setSpecs}
				groups={groups}
				data={data}
				remove={remove}
			/>
		</div>
	);
}

function EditCPgrid({ conf, setField, data, groups, remove, noConf, style }) {
	const { isDropTarget, ref } = useDroppable({
		id: crypto.randomUUID(),
		disabled: noConf,
		collisionDetector: closestCenter,
	});
	return (
		<div ref={ref} className={styles.grid} style={style}>
			{conf?.map((item, index) => (
				<DraggableElem
					index={index}
					setSpecs={(fieldName, val) => {
						setField(index, fieldName, val);
					}}
					key={index}
					item={item}
					data={data}
					groups={groups}
					remove={() => {
						remove(index);
					}}
				></DraggableElem>
			))}
		</div>
	);
}
export default EditCPgrid;
