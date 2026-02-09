import React from 'react';
import ConfirmFileDeleteModal from '../modals/confirmFileDeleteModal';
import PropTypes from 'prop-types';
const DeleteButton = ({ filepath }) => {
	const confirmUrl = `/api/files${filepath}`;
	console.log(confirmUrl);
	return (
		<div>
			<ConfirmFileDeleteModal state={confirmUrl}></ConfirmFileDeleteModal>
		</div>
	);
};
DeleteButton.propTypes = {
	filepath: PropTypes.string,
};
export default DeleteButton;
