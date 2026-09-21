import React from 'react';
import { useDraggable, useDroppable, DragDropProvider } from '@dnd-kit/react';
import styles from './controlPanel.module.css';
function EditControlPanel({ x, y, conf, setConf }) {
	let rows = [];
	for (let i = 0; i < x; i++) {
		let items = [];
		for (let j = 0; j < y; j++) {
			const drop = useDroppable({ id: i + '-' + j });
			const item = <div ref={drop.ref} />;
			items.push(item);
		}
		const row = <div className={styles.row}>{items}</div>;
		rows.push(row);
	}
	return (
		<DragDropProvider>
			<div className={styles.panel}>{rows}</div>
		</DragDropProvider>
	);
}
