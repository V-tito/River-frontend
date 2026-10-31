import styles from '../controlPanel.module.css';

export default function SetCPSize({ x, setX, y, setY }) {
	console.debug('x', x, 'y', y);
	return (
		<div className={styles.setsize}>
			<label>
				Ширина
				<input
					type="number"
					defaultValue={x}
					onChange={e => setX(e.target.value + 'px')}
				/>
			</label>
			<label>
				Высота
				<input
					type="number"
					defaultValue={y}
					onChange={e => setY(e.target.value + 'px')}
				/>
			</label>
		</div>
	);
}
