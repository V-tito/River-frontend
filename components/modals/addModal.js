'use client';
import AddForm from '../forms/addForm';
import PopupForm from './popupForm';
import React from 'react';
import PropTypes from 'prop-types';
const AddModal = ({ table }) => {
	return (
		<PopupForm buttonLabel={'Создать'}>
			<AddForm table={table}></AddForm>
		</PopupForm>
	);
};
AddModal.propTypes = {
	table: PropTypes.string.isRequired,
};
export default AddModal;
