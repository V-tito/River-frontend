'use client';
import React, { useState } from 'react';
import styles from './form.module.css'; // Updated import path
import ConfirmDeleteModal from '../modals/confirmDeleteModal';
import PropTypes from 'prop-types';

const DeleteForm = ({ table, listOfAll = [[]] }) => {
	const [confirmUrl, setConfirmUrl] = useState(null);

	const handleChange = e => {
		const { value } = e.target;
		const val = listOfAll.find(item => item.id == value);
		setConfirmUrl({
			type: table,
			name: val.name,
			group: val.parentGroup ? val.parentGroup : null,
		});
		console.log('econfirm data', confirmUrl);
	};

	const handleSubmit = e => {
		e.preventDefault();
	};

	console.log('listForDel', listOfAll);
	if (listOfAll === undefined) return <p>Загрузка...</p>;
	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<header className={styles.header}>Удалить элемент</header>
			<div>
				<label>{'Выберите элемент для удаления:'}</label>
				<select
					className={styles.select}
					type="number"
					id="id"
					required
					onChange={handleChange}
				>
					<option value={null}>Выберите элемент...</option>
					{listOfAll.map(item =>
						item instanceof Array ? (
							item.map(piece => (
								<option key={piece.id} value={piece.id}>
									{piece.parentGroup ? piece.parentGroup : ''}:{piece.name}
								</option>
							))
						) : (
							<option key={item.id} value={item.id}>
								{item.parentGroup ? item.parentGroup : ''}:{item.name}
							</option>
						)
					)}
				</select>
			</div>
			<ConfirmDeleteModal state={confirmUrl}></ConfirmDeleteModal>
			<p></p>
		</form>
	);
};

DeleteForm.propTypes = {
	table: PropTypes.string.isRequired,
	listOfAll: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
};

export default DeleteForm;
