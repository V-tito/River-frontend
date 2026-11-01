import { useEffect, useState } from 'react';
import styles from '../controlPanel.module.css';
import { useForm } from 'react-hook-form';

export default function SetCPSize({ x, setX, y, setY, cp }) {
	const { reset, resetDefaultValues, register } = useForm({
		defaultValues: { x: x, y: y },
	});
	useEffect(() => {
		resetDefaultValues({ x: x, y: y });
		reset();
	}, [cp]);
	console.debug('x', x, 'y', y);
	return (
		<div className={styles.setsize}>
			<label>
				Ширина
				<input
					type="number"
					{...register('x')}
					onChange={e => setX(e.target.value)}
				/>
			</label>
			<label>
				Высота
				<input
					type="number"
					{...register('y')}
					onChange={e => setY(e.target.value)}
				/>
			</label>
		</div>
	);
}
