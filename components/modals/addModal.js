'use client';
import AddForm from '../forms/addForm';
import PopupForm from '../templateComponents/popupForm';
import React from 'react';
import PropTypes from 'prop-types';
const AddModal = ({ table, prototype }) => {
	return (
		<PopupForm buttonLabel={'Создать вручную'}>
			<AddForm table={table} object={prototype ?? {}}></AddForm>
		</PopupForm>
	);
};
AddModal.propTypes = {
	table: PropTypes.string.isRequired,
};
export default AddModal;
