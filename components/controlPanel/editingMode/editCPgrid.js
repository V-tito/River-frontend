import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import EditCPelem from './editCPelem';
import styles from '../controlPanel.module.css';
import { useSortable } from '@dnd-kit/react/sortable';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';

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
function Blank({ index }) {
	const { ref } = useSortable({
		id: crypto.randomUUID(),
		index: index,
		type: 'blank',
		collisionPriority: 1,
	});
	return <li ref={ref} className="w-full h-full" />;
}
function EditCPgrid({ conf, setField, data, groups, remove, blankIndex }) {
	//for rep with coordinates
	/**let rows = [];
	for (let i = 0; i < x; i++) {
		let items = [];
		for (let j = 0; j < y; j++) {
			const drop = useDroppable({ id: i + '-' + j });
			const item = <div ref={drop.ref} />;
			items.push(item);
		}
		const row = <div className={styles.row}>{items}</div>;
		rows.push(row);
	}**/

	const { isDropTarget, ref } = useDroppable({
		id: crypto.randomUUID(),
		type: 'panel',
		collisionPriority: 1,
	});

	console.debug('remove action', remove);
	return (
		<div ref={ref} className="flex w-full">
			<ul className={styles.grid}>
				{conf
					?.map((item, index) => (
						<SortableElem
							index={index >= blankIndex ? index + 1 : index}
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
						></SortableElem>
					))
					.toSpliced(
						blankIndex,
						0,
						<Blank index={blankIndex} key={conf.length + 1} />
					)}
			</ul>
		</div>
	);
}
export default EditCPgrid;
