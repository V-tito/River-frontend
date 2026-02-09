import React from 'react';
import PropTypes from 'prop-types';
import FileView from './fileManagement/fileView';
const FileUI = ({ scheme }) => {
	console.log(scheme.name);
	return <FileView folder={scheme.name}></FileView>;
};
FileUI.propTypes = {
	scheme: PropTypes.shape({ name: PropTypes.string }),
};
export default FileUI;
