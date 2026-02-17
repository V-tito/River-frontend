'use client';
import React, { useState } from 'react';
import styles from './form.module.css'; // Updated import path
import ConfirmDeleteModal from '../modals/confirmDeleteModal';
import PropTypes from 'prop-types';

const DeleteForm = ({ table, listOfAll = [[]] }) => {
	const [formData, setFormData] = useState();
	const [confirmUrl, setConfirmUrl] = useState(null);

	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setConfirmUrl({ type: table, name: value });
	};

	const handleSubmit = e => {
		e.preventDefault();
	};

	console.log(listOfAll);
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
								<option key={piece.id} value={piece.name}>
									{piece.name}
								</option>
							))
						) : (
							<option key={item.id} value={item.name}>
								{item.name}
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
