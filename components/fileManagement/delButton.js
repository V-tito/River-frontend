import React from 'react';
import ConfirmFileDeleteModal from '../modals/confirmFileDeleteModal';
import PropTypes from 'prop-types';
const DeleteButton = ({ filepath, className }) => {
	const confirmUrl = `/api/files${filepath}`;
	console.log(confirmUrl);
	return (
		<div>
			<ConfirmFileDeleteModal
				buttonStyle={className}
				state={confirmUrl}
			></ConfirmFileDeleteModal>
		</div>
	);
};
DeleteButton.propTypes = {
	filepath: PropTypes.string,
	className: PropTypes.string,
};
export default DeleteButton;
