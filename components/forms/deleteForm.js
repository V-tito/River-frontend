'use client';
import React, { useState } from 'react';
import styles from './form.module.css'; // Updated import path
import ConfirmDeleteModal from '../modals/confirmDeleteModal';
import PropTypes from 'prop-types';

const DeleteForm = ({ table, listOfAll = [[]] }) => {
	const [confirmUrl, setConfirmUrl] = useState(null);

	const handleChange = e => {
		const { name, value } = e.target;
		console.log(value)
		setConfirmUrl(table=='Signal'? { type: table, name: value.split(":")[1],group:value.split(":")[0] }:{ type: table, name: value,group:null});
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
								<option key={piece.id} value={JSON.stringify({group:piece.parentGroup,id:piece.name})}>
									{piece.name}
								</option>
							))
						) : (
							<option key={item.id} value={table=='Signal'?`${item.parentGroup}:${item.name}`:item.name}>
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
