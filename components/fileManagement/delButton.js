import React from 'react';
import ConfirmFileDeleteModal from '../modals/confirmFileDeleteModal';
import PropTypes from 'prop-types';
const DeleteButton = ({ filepath, className }) => {
	const confirmUrl = `/api/files${filepath}`;
	return <ConfirmFileDeleteModal buttonStyle={className} state={confirmUrl} />;
};
DeleteButton.propTypes = {
	filepath: PropTypes.string,
	className: PropTypes.string,
};
export default DeleteButton;
