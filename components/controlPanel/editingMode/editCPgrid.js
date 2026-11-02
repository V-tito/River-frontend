import React, { useEffect, useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import EditCPelem from './editCPelem';
import styles from '../controlPanel.module.css';
import { useSortable } from '@dnd-kit/react/sortable';
import { closestCenter } from '@dnd-kit/collision';
import buttonStyles from '@/styles/buttonStyles.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import headerStyles from '@/styles/headerStyles.module.css';
import { Feedback } from '@dnd-kit/dom';
import { getBackground } from '@/utils/api_wrap/fileAPI';

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
function DraggableElem({
	index,
	setSpecs,
	item,
	data,
	groups,
	remove,
	parent,
}) {
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
	console.debug(
		'made draggable with ref',
		ref,
		'from item',
		item,
		'which is dragging?',
		isDragging
	);
	const parentRect = parent.current
		? parent.current?.getBoundingClientRect()
		: null;
	console.debug('parent in draggable elem', parent);
	console.debug('parent bounds in draggable elem', parentRect);
	let x = item?.position?.x,
		y = item?.position?.y;
	console.debug('in draggable elem, x', x, 'y', y);
	if (parentRect) {
		const { left, right, top, bottom, width, height } = parentRect;
		console.debug(y && height, y < height, top < y, y < bottom);
		console.debug(x && width, left < x && x < right, left < x, x < right);
		y = y && height ? (y < height ? (y > 0 ? y : 0) : height) : '';
		x = x && width ? (x < width ? (x > 0 ? x : 0) : '') : '';
	}
	return (
		<div
			style={{
				position: 'absolute',
				top: isDragging ? undefined : y,
				left: isDragging ? undefined : x,
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

function EditCPgrid({
	conf,
	setField,
	data,
	groups,
	remove,
	noConf,
	style,
	parent,
	envName,
}) {
	const [styl, setStyl] = useState({});
	useEffect(() => {
		const resetStyle = async () => {
			if (style) {
				let back;
				if (style.background) {
					back = await getBackground(envName, style.background);
				}
				const temp = {
					width: style.width + 'px',
					height: style.height + 'px',
					backgroundImage: back ? 'url(' + back + ')' : null,
					backgroundSize: style.width + 'px ' + style.height + 'px',
				};
				setStyl(temp);
			} else setStyl({});
		};
		resetStyle();
	}, []);
	useEffect(() => {
		if (noConf) setStyl({ background: null, width: 100, height: 100 });
	}, [noConf]);
	useEffect(() => {
		const resetStyle = async () => {
			if (style) {
				let back;
				if (style.background) {
					back = await getBackground(envName, style.background);
				}
				const temp = {
					width: style.width + 'px',
					height: style.height + 'px',
					backgroundImage: back ? 'url(' + back + ')' : null,
					backgroundSize: style.width + 'px ' + style.height + 'px',
				};
				setStyl(temp);
			}
		};
		resetStyle();
	}, [style]);
	const { isDropTarget, ref } = useDroppable({
		id: crypto.randomUUID(),
		disabled: noConf,
		collisionDetector: closestCenter,
	});
	return (
		<div
			ref={ref}
			className={styles.grid}
			style={{ ...styl, position: 'relative' }}
		>
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
					parent={parent}
				></DraggableElem>
			))}
		</div>
	);
}
export default EditCPgrid;
