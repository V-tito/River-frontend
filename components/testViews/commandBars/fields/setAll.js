'use client';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import styles from '../commandBar.module.css';
import inputStyles from '@/styles/inputStyles.module.css';
import { BarContext } from '../barEditor';

export default function SetAll({ command, fieldName, updateAction, disabled }) {
	const { inputsByBoard } = useContext(BarContext);
	console.debug('inputs by board in setAll');
	const channels = [];
	for (let i = 0; i < 32; i++) {
		const channelform = (
			<div className="flex flex-row" key={i}>
				<label className={styles.label}>Канал {i}</label>
				<input
					type="radio"
					id="values"
					value={1}
					onChange={updateAction}
					data-flagindex={i}
					checked={command.values[i] == 1}
					className={`${inputStyles.radio} ${styles.radio}`}
					disabled={disabled}
				/>
				Активен
				<input
					type="radio"
					id="values"
					value={0}
					onChange={updateAction}
					data-flagindex={i}
					checked={command.values[i] == 0}
					className={`${inputStyles.radio} ${styles.radio}`}
					disabled={disabled}
				/>
				Неактивен
			</div>
		);
		channels.push(channelform);
	}

	return (
		<div>
			<label className={styles.label}>Плата: </label>
			<select
				value={command.board}
				className={inputStyles.select}
				onChange={updateAction}
				disabled={disabled}
				id="board"
			>
				{command.board == '' ? <option value={''}>плата...</option> : ''}
				{inputsByBoard
					? Object.keys(inputsByBoard).map(item => (
							<option value={item} key={item}>
								{item}
							</option>
						))
					: ''}
			</select>

			{[undefined, ''].includes(command.board) ? (
				''
			) : (
				<div className="flex flex-col">{channels}</div>
			)}
		</div>
	);
}
