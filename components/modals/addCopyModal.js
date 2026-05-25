import AddForm from '../forms/addForm';
import PopupForm from './popupForm';
import React from 'react';
import PropTypes, { object } from 'prop-types';
const AddCopyModal = ({ table, object }) => {
	return (
		<PopupForm buttonLabel={'Редактировать копию'}>
			<AddForm table={table} object={object}></AddForm>
		</PopupForm>
	);
};
AddCopyModal.propTypes = {
	table: PropTypes.string.isRequired,
	object: PropTypes.shape(),
};
export default AddCopyModal;
